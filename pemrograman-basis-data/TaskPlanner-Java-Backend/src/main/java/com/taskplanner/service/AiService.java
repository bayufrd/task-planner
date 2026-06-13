package com.taskplanner.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AiService {

    private static final String INDONESIA_TIME_ZONE = "Asia/Jakarta";
    private static final int INDONESIA_UTC_OFFSET_HOURS = 7;
    private static final String DEFAULT_MODEL = "cx/gpt-5.2";

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;
    private final String nineRouterApi;
    private final String nineRouterApiKey;
    private final String nineRouterModel;

    public AiService(
            ObjectMapper objectMapper,
            @Value("${ai.nine-router.api:}") String nineRouterApi,
            @Value("${ai.nine-router.api-key:}") String nineRouterApiKey,
            @Value("${ai.nine-router.model:" + DEFAULT_MODEL + "}") String nineRouterModel) {
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newHttpClient();
        this.nineRouterApi = nineRouterApi;
        this.nineRouterApiKey = nineRouterApiKey;
        this.nineRouterModel = (nineRouterModel == null || nineRouterModel.isBlank()) ? DEFAULT_MODEL : nineRouterModel;
    }

    public Map<String, Object> parseTaskCommand(String command) {
        if (command == null || command.trim().isEmpty()) {
            throw new IllegalArgumentException("Command is required");
        }
        if (command.length() > 1000) {
            throw new IllegalArgumentException("Command is too long");
        }
        ensureNineRouterConfigured();

        ZonedDateTime now = ZonedDateTime.now(ZoneId.of(INDONESIA_TIME_ZONE));
        Map<String, Object> userPayload = new LinkedHashMap<>();
        userPayload.put("currentDateTime", now.toInstant().toString());
        userPayload.put("localDateString", now.toLocalDate().toString());
        userPayload.put("localTimeString", now.toLocalTime().truncatedTo(ChronoUnit.SECONDS).toString());
        userPayload.put("timezone", INDONESIA_TIME_ZONE);
        userPayload.put("timezoneOffsetHours", INDONESIA_UTC_OFFSET_HOURS);
        userPayload.put("command", command);

        String systemPrompt = String.join("\n",
                "You are a deterministic task command parser for Smart Task Planner.",
                "Return ONLY valid JSON. No markdown, no explanation.",
                "Parse Indonesian and English natural language task commands.",
                "Output schema:",
                "{",
                "  \"title\": string,",
                "  \"description\": string,",
                "  \"deadline\": ISO-8601 string,",
                "  \"priority\": \"HIGH\" | \"MEDIUM\" | \"LOW\",",
                "  \"estimatedDuration\": number,",
                "  \"tags\": string[],",
                "  \"reminderTime\": number",
                "}",
                "Rules:",
                "- title: clean task title without date/time/duration/priority/tag tokens.",
                "- deadline: always output absolute ISO-8601 datetime using the provided current datetime as reference.",
                "- Interpret all Indonesian date/time phrases in timezone Asia/Jakarta (WIB / UTC+7).",
                "- Indonesian \"besok\" means exactly local current date + 1 day, not +2 days.",
                "- Indonesian \"lusa\" means exactly local current date + 2 days.",
                "- Indonesian \"hari ini\" means local current date.",
                "- Indonesian \"jam 8 malam\" = 20:00, \"jam 9 malam\" = 21:00, \"jam 10 malam\" = 22:00, \"jam 12 malam\" = 00:00.",
                "- Indonesian \"jam 8 pagi\" = 08:00, \"jam 9 pagi\" = 09:00, \"jam 10 pagi\" = 10:00.",
                "- Indonesian \"jam 12 siang\" = 12:00.",
                "- Indonesian \"jam 3 sore\" = 15:00, \"jam 6 sore\" = 18:00, \"jam 7 sore\" = 19:00.",
                "- If user writes pagi/siang/sore/malam, convert to 24-hour Indonesian local time correctly.",
                "- priority default: MEDIUM.",
                "- estimatedDuration default: 60 minutes if omitted.",
                "- reminderTime default: 60 minutes before deadline if omitted.",
                "- tags: extract hashtags without #; default [].",
                "- If command says important/urgent/penting/mendesak, priority HIGH.",
                "- If command says low/santai/rendah, priority LOW.",
                "- If deadline is omitted, use tomorrow at 09:00 local time.",
                "- If date exists but time omitted, use 09:00 local time.",
                "- Never invent unrelated details.");

        Map<String, Object> parsed = requestChatJson(systemPrompt, userPayload, 0.0);
        String title = stringValue(parsed.get("title")).trim();
        if (title.isEmpty()) {
            throw new IllegalStateException("Parsed task title is missing");
        }

        String parsedDeadline = stringValue(parsed.get("deadline"));
        ZonedDateTime fallbackDeadline = now.plusDays(1).withHour(9).withMinute(0).withSecond(0).withNano(0);
        ZonedDateTime normalizedDeadline = normalizeDeadlineWithCommandHints(command, parsedDeadline, now, fallbackDeadline);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("title", title);
        result.put("description", stringValue(parsed.get("description")).trim());
        result.put("deadline", normalizedDeadline.toInstant().toString());
        result.put("priority", normalizePriority(parsed.get("priority")));
        result.put("status", "TODO");
        result.put("estimatedDuration", normalizeDuration(parsed.get("estimatedDuration")));
        result.put("tags", normalizeTags(parsed.get("tags")));
        result.put("reminderTime", normalizeReminderTime(parsed.get("reminderTime")));
        return result;
    }

    public Map<String, Object> analyzeOverview(String userId, Map<String, Integer> stats, List<Map<String, Object>> dailyData) {
        ensureNineRouterConfigured();

        int pending = intValue(stats.get("pending"));
        int done = intValue(stats.get("done"));
        int skipped = intValue(stats.get("skipped"));
        int total = pending + done + skipped;
        int completionRate = total > 0 ? Math.round((done * 100f) / total) : 0;
        int skipRate = total > 0 ? Math.round((skipped * 100f) / total) : 0;

        List<Map<String, Object>> recentDays = dailyData.size() > 7
                ? dailyData.subList(Math.max(dailyData.size() - 7, 0), dailyData.size())
                : dailyData;

        int avgDailyCompletion = recentDays.isEmpty()
                ? 0
                : Math.round((float) recentDays.stream().mapToInt(item -> intValue(item.get("count"))).sum() / recentDays.size());

        String systemPrompt = String.join("\n",
                "Anda adalah AI analisis produktivitas untuk Smart Task Planner.",
                "Analisis pola penyelesaian tugas pengguna dan berikan wawasan yang dapat ditindaklanjuti.",
                "Kembalikan HANYA JSON yang valid. Tidak ada markdown, tidak ada penjelasan.",
                "Skema output:",
                "{",
                "  \"score\": number (0-100),",
                "  \"insights\": string[] (3-5 observasi kunci dalam Bahasa Indonesia),",
                "  \"advice\": [{ \"title\": string, \"description\": string, \"type\": \"success\"|\"warning\"|\"info\" }] (3 kartu dalam Bahasa Indonesia)",
                "}",
                "Aturan:",
                "- score: 0-100 berdasarkan tingkat penyelesaian, konsistensi, dan keseimbangan beban kerja",
                "- insights: observasi spesifik tentang pola dalam Bahasa Indonesia",
                "- advice: rekomendasi yang dapat ditindaklanjuti dengan tipe yang sesuai dalam Bahasa Indonesia",
                "- Bersikaplah mendorong tetapi jujur",
                "- Fokus pada peningkatan produktivitas");

        Map<String, Object> userPayload = new LinkedHashMap<>();
        userPayload.put("userId", userId);
        userPayload.put("totalTasks", total);
        userPayload.put("completed", done);
        userPayload.put("pending", pending);
        userPayload.put("skipped", skipped);
        userPayload.put("completionRate", completionRate + "%");
        userPayload.put("skipRate", skipRate + "%");
        userPayload.put("avgDailyCompletion", avgDailyCompletion);
        userPayload.put("recentDailyData", recentDays);

        Map<String, Object> parsed = requestChatJson(systemPrompt, userPayload, 0.3);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("score", Math.max(0, Math.min(100, intValue(parsed.get("score"), 50))));
        result.put("insights", normalizeStringList(parsed.get("insights"), 5));
        result.put("advice", normalizeAdvice(parsed.get("advice")));
        return result;
    }

    private Map<String, Object> requestChatJson(String systemPrompt, Object userPayload, double temperature) {
        try {
            Map<String, Object> body = new LinkedHashMap<>();
            body.put("model", nineRouterModel);
            body.put("stream", false);
            body.put("temperature", temperature);
            body.put("messages", List.of(
                    Map.of("role", "system", "content", systemPrompt),
                    Map.of("role", "user", "content", objectMapper.writeValueAsString(userPayload))
            ));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(nineRouterApi))
                    .header("Authorization", "Bearer " + nineRouterApiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(body)))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new IllegalStateException("9Router request failed: " + response.statusCode() + " " + response.body());
            }

            Map<String, Object> root = objectMapper.readValue(response.body(), new TypeReference<>() {});
            Object content = extractMessageContent(root);
            if (!(content instanceof String) || ((String) content).isBlank()) {
                throw new IllegalStateException("9Router response did not include message content");
            }

            return parseJsonFromText((String) content);
        } catch (IOException | InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Failed to call 9Router", e);
        }
    }

    private Object extractMessageContent(Map<String, Object> root) {
        Object choices = root.get("choices");
        if (!(choices instanceof List<?> list) || list.isEmpty()) {
            return null;
        }
        Object first = list.get(0);
        if (!(first instanceof Map<?, ?> firstMap)) {
            return null;
        }
        Object message = firstMap.get("message");
        if (!(message instanceof Map<?, ?> messageMap)) {
            return null;
        }
        return messageMap.get("content");
    }

    private Map<String, Object> parseJsonFromText(String text) throws IOException {
        String trimmed = text.trim();
        java.util.regex.Matcher matcher = java.util.regex.Pattern.compile("```(?:json)?\\s*([\\s\\S]*?)\\s*```", java.util.regex.Pattern.CASE_INSENSITIVE)
                .matcher(trimmed);
        String jsonText = matcher.find() ? matcher.group(1) : trimmed;
        return objectMapper.readValue(jsonText, new TypeReference<>() {});
    }

    private ZonedDateTime normalizeDeadlineWithCommandHints(String input, String deadline, ZonedDateTime now, ZonedDateTime fallback) {
        ZonedDateTime base = parseIsoDateTime(deadline);
        if (base == null) {
            base = fallback;
        }
        return applyIndonesianTimeHints(input, base, now);
    }

    private ZonedDateTime parseIsoDateTime(String raw) {
        if (raw == null || raw.isBlank()) {
            return null;
        }
        try {
            return ZonedDateTime.parse(raw);
        } catch (Exception ignored) {
        }
        try {
            return Instant.parse(raw).atZone(ZoneId.of(INDONESIA_TIME_ZONE));
        } catch (Exception ignored) {
        }
        return null;
    }

    private ZonedDateTime applyIndonesianTimeHints(String input, ZonedDateTime deadline, ZonedDateTime now) {
        String lower = input == null ? "" : input.toLowerCase(Locale.ROOT);
        ZonedDateTime base = deadline.withZoneSameInstant(ZoneId.of(INDONESIA_TIME_ZONE));

        if (lower.matches(".*\\bbesok\\b.*")) {
            base = now.plusDays(1).withHour(base.getHour()).withMinute(base.getMinute()).withSecond(0).withNano(0);
        } else if (lower.matches(".*\\blusa\\b.*")) {
            base = now.plusDays(2).withHour(base.getHour()).withMinute(base.getMinute()).withSecond(0).withNano(0);
        } else if (lower.matches(".*\\b(hari ini|today)\\b.*")) {
            base = now.withHour(base.getHour()).withMinute(base.getMinute()).withSecond(0).withNano(0);
        }

        java.util.regex.Matcher setengah = java.util.regex.Pattern
                .compile("\\b(?:jam|pukul)\\s+setengah\\s+(\\d{1,2})\\s*(pagi|siang|sore|malam)?\\b")
                .matcher(lower);
        if (setengah.find()) {
            int hour = Math.max(Integer.parseInt(setengah.group(1)) - 1, 0);
            hour = adjustHourByPeriod(hour, setengah.group(2));
            return base.withHour(hour).withMinute(30).withSecond(0).withNano(0);
        }

        java.util.regex.Matcher jam = java.util.regex.Pattern
                .compile("\\b(?:jam|pukul)\\s+(\\d{1,2})(?:(?::|\\.)(\\d{2}))?\\s*(pagi|siang|sore|malam)?\\b")
                .matcher(lower);
        if (jam.find()) {
            int hour = adjustHourByPeriod(Integer.parseInt(jam.group(1)), jam.group(3));
            int minute = jam.group(2) != null ? Integer.parseInt(jam.group(2)) : 0;
            return base.withHour(hour).withMinute(minute).withSecond(0).withNano(0);
        }

        return base;
    }

    private int adjustHourByPeriod(int hour, String period) {
        if (period == null || period.isBlank()) {
            return Math.max(0, Math.min(hour, 23));
        }
        return switch (period) {
            case "malam" -> hour == 12 ? 0 : (hour >= 1 && hour <= 11 ? hour + 12 : hour);
            case "sore" -> (hour >= 1 && hour <= 11 ? hour + 12 : hour);
            case "siang" -> (hour >= 1 && hour <= 10 ? hour + 12 : hour);
            case "pagi" -> hour == 12 ? 0 : hour;
            default -> hour;
        };
    }

    private String normalizePriority(Object priority) {
        String value = stringValue(priority).toUpperCase(Locale.ROOT);
        if ("HIGH".equals(value) || "MEDIUM".equals(value) || "LOW".equals(value)) {
            return value;
        }
        return "MEDIUM";
    }

    private int normalizeDuration(Object duration) {
        int value = intValue(duration, 60);
        return value > 0 ? value : 60;
    }

    private int normalizeReminderTime(Object reminderTime) {
        int value = intValue(reminderTime, 60);
        return value >= 0 ? value : 60;
    }

    private List<String> normalizeTags(Object tags) {
        if (!(tags instanceof List<?> list)) {
            return List.of();
        }
        List<String> result = new ArrayList<>();
        for (Object item : list) {
            String value = stringValue(item).replaceFirst("^#", "").trim();
            if (!value.isBlank()) {
                result.add(value);
            }
            if (result.size() >= 10) {
                break;
            }
        }
        return result;
    }

    private List<String> normalizeStringList(Object value, int maxItems) {
        if (!(value instanceof List<?> list)) {
            return List.of();
        }
        List<String> result = new ArrayList<>();
        for (Object item : list) {
            String text = stringValue(item).trim();
            if (!text.isBlank()) {
                result.add(text);
            }
            if (result.size() >= maxItems) {
                break;
            }
        }
        return result;
    }

    private List<Map<String, Object>> normalizeAdvice(Object value) {
        if (!(value instanceof List<?> list)) {
            return List.of();
        }
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object item : list) {
            if (item instanceof Map<?, ?> map) {
                Map<String, Object> advice = new LinkedHashMap<>();
                advice.put("title", stringValue(map.get("title")).isBlank() ? "Tip" : stringValue(map.get("title")));
                advice.put("description", stringValue(map.get("description")));
                String type = stringValue(map.get("type"));
                advice.put("type", List.of("success", "warning", "info").contains(type) ? type : "info");
                result.add(advice);
            }
            if (result.size() >= 3) {
                break;
            }
        }
        return result;
    }

    private int intValue(Object value) {
        return intValue(value, 0);
    }

    private int intValue(Object value, int defaultValue) {
        if (value instanceof Number number) {
            return Math.round(number.floatValue());
        }
        try {
            return value == null ? defaultValue : Math.round(Float.parseFloat(String.valueOf(value)));
        } catch (Exception ignored) {
            return defaultValue;
        }
    }

    private String stringValue(Object value) {
        return value == null ? "" : String.valueOf(value);
    }

    private void ensureNineRouterConfigured() {
        if (nineRouterApi == null || nineRouterApi.isBlank() || nineRouterApiKey == null || nineRouterApiKey.isBlank()) {
            throw new IllegalStateException("9Router is not configured");
        }
    }
}
