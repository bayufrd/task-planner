Nama : Bayu Farid Mulyanto
NIM : 411251181
Mata Kuliah : Pemrograman Basis Data
Dosen : Dea Andini Andriati, S.Kom., M.M.S.I

# Dokumentasi Implementasi DQL, Prepared Statement, Create, Read, dan Data Mapping

---

## I. PEMBAHASAN TEORI

### 1. Sifat DQL SELECT

Perintah `SELECT` dalam DQL disebut pasif dan non-destruktif karena hanya membaca data dari database tanpa mengubah isi tabel.

Pada aplikasi **TaskPlanner-Java-Backend**, perintah `SELECT` digunakan untuk mengambil data task dari tabel `Task`. Contohnya:

```sql
SELECT * FROM Task WHERE userId = ?;
```

Perintah ini hanya mengambil snapshot data. Isi tabel tetap sama sebelum dan sesudah query dijalankan. SELECT tidak termasuk operasi yang mengubah state database.

### 2. Risiko String Concatenation dalam Query SQL

String concatenation adalah teknik menggabungkan string query dengan input user secara langsung.

Contoh berbahaya:

```java
String query = "INSERT INTO Task (title) VALUES ('" + title + "')";
```

Jika user mengisi title dengan `' OR '1'='1`, query bisa berubah menjadi:

```sql
SELECT * FROM Task WHERE title = '' OR '1'='1';
```

Kondisi `'1'='1'` selalu benar, sehingga attacker bisa mengakses seluruh data.

Solusi yang digunakan adalah **prepared statement** dengan parameter binding.

---

## II. IMPLEMENTASI SISTEM

### 1. Persiapan Objek Data Mapping

Entitas yang dipilih adalah **Task**. Tabel `Task` menyimpan data tugas atau rencana pekerjaan user.

Data dari tabel `Task` dipetakan ke dalam class `Task` di Java:

```java
public class Task {
    private String id;
    private String userId;
    private String title;
    private String description;
    private String deadline;
    private String priority;
    private String status;
    private Integer estimatedDuration;
    private Boolean reminderSent;
    private Integer reminderTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime completedAt;
}
```

Mapping dari database ke object dilakukan menggunakan `RowMapper`:

```java
private final RowMapper<Task> taskRowMapper = (rs, rowNum) -> {
    Task task = new Task();
    task.setId(rs.getString("id"));
    task.setUserId(rs.getString("userId"));
    task.setTitle(rs.getString("title"));
    task.setDescription(rs.getString("description"));
    task.setDeadline(rs.getString("deadline"));
    task.setPriority(rs.getString("priority"));
    task.setStatus(rs.getString("status"));
    task.setEstimatedDuration(rs.getObject("estimatedDuration") != null ? rs.getInt("estimatedDuration") : null);
    task.setReminderSent(rs.getBoolean("reminderSent"));
    task.setReminderTime(rs.getInt("reminderTime"));
    task.setCreatedAt(rs.getObject("createdAt", Timestamp.class) != null ? rs.getTimestamp("createdAt").toLocalDateTime() : null);
    task.setUpdatedAt(rs.getObject("updatedAt", Timestamp.class) != null ? rs.getTimestamp("updatedAt").toLocalDateTime() : null);
    task.setCompletedAt(rs.getObject("completedAt", Timestamp.class) != null ? rs.getTimestamp("completedAt").toLocalDateTime() : null);
    return task;
};
```

Saya menggunakan object karena lebih terstruktur dibanding array biasa. Kalau pakai array, kita harus akses pakai index seperti `row[0]` yang membingungkan. Dengan object kita bisa pakai `task.getTitle()` jadi lebih jelas dan mudah dibaca.

---

### 2. Implementasi Fitur Tambah Data Create

Fitur create dilakukan melalui endpoint `POST /api/tasks`.

Data input diterima oleh `CreateTaskRequest`:

```java
public class CreateTaskRequest {
    private String title;
    private String description;
    private String deadline;
    private String priority;
    private String status;
    private Integer estimatedDuration;
}
```

Service membuat object `Task` dan memanggil repository:

```java
public Task createTask(String userId, CreateTaskRequest request) {
    Task task = new Task();
    task.setId(UUID.randomUUID().toString());
    task.setUserId(userId);
    task.setTitle(request.getTitle());
    task.setDescription(request.getDescription());
    task.setDeadline(request.getDeadline());
    task.setPriority(request.getPriority() != null ? request.getPriority() : "MEDIUM");
    task.setStatus(request.getStatus() != null ? request.getStatus() : "TODO");
    task.setEstimatedDuration(request.getEstimatedDuration());
    task.setReminderTime(60);
    task.setReminderSent(false);
    task.setCreatedAt(LocalDateTime.now());
    task.setUpdatedAt(LocalDateTime.now());
    return taskRepository.create(task);
}
```

Repository menjalankan query `INSERT INTO Task` menggunakan **prepared statement**:

```java
public Task create(Task task) {
    String query = "INSERT INTO Task (id, userId, title, description, deadline, priority, status, " +
                   "estimatedDuration, reminderTime, reminderSent, createdAt, updatedAt) " +
                   "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";
    
    jdbcTemplate.update(query,
        task.getId(),
        task.getUserId(),
        task.getTitle(),
        task.getDescription(),
        task.getDeadline(),
        task.getPriority() != null ? task.getPriority() : "MEDIUM",
        task.getStatus() != null ? task.getStatus() : "TODO",
        task.getEstimatedDuration(),
        task.getReminderTime() != null ? task.getReminderTime() : 60,
        false
    );
    return task;
}
```

- Tanda `?` adalah placeholder.
- Nilai dikirim sebagai parameter.
- Input user tidak digabung langsung ke query SQL.
- Ini mencegah SQL Injection.

---

### 3. Implementasi Fitur Tampilkan Data Read

Fitur read dilakukan melalui endpoint `GET /api/tasks`.

Repository menjalankan query `SELECT * FROM Task WHERE userId = ?`:

```java
public List<Task> findByUserId(String userId, int page, int limit, String search, String status, String priority, String sort, String order) {
    StringBuilder query = new StringBuilder("SELECT * FROM Task WHERE userId = ?");
    
    if (search != null && !search.isBlank()) {
        query.append(" AND (title LIKE ? OR description LIKE ?)");
    }
    if (status != null && !status.isBlank()) {
        query.append(" AND status = ?");
    }
    if (priority != null && !priority.isBlank()) {
        query.append(" AND priority = ?");
    }
    
    query.append(" ORDER BY ").append(sort != null ? sort : "deadline")
         .append(" ").append(order != null ? order : "ASC");
    query.append(" LIMIT ? OFFSET ?");

    int offset = (page - 1) * limit;
    Object[] params = buildParams(userId, search, status, priority, limit, offset);

    return jdbcTemplate.query(query.toString(), taskRowMapper, params);
}
```

Hasil query dipetakan menjadi list of objects menggunakan `taskRowMapper`.

Parameter binding digunakan agar input user tidak dianggap sebagai perintah SQL:

```java
private Object[] buildParams(String userId, String search, String status, String priority, int limit, int offset) {
    int paramCount = 1;
    if (search != null && !search.isBlank()) paramCount += 2;
    if (status != null && !status.isBlank()) paramCount += 1;
    if (priority != null && !priority.isBlank()) paramCount += 1;
    paramCount += 2;

    Object[] params = new Object[paramCount];
    int index = 0;
    
    params[index++] = userId;
    if (search != null && !search.isBlank()) {
        String searchTerm = "%" + search + "%";
        params[index++] = searchTerm;
        params[index++] = searchTerm;
    }
    if (status != null && !status.isBlank()) {
        params[index++] = status;
    }
    if (priority != null && !priority.isBlank()) {
        params[index++] = priority;
    }
    params[index++] = limit;
    params[index++] = offset;

    return params;
}
```

---

## III. LAPORAN SINGKAT

Alur data yang digunakan:

1. User mengirim request melalui API.
2. Controller menerima input dan mengirim ke service.
3. Service menjalankan business logic dan membuat object `Task`.
4. Repository menjalankan query SQL ke database.
5. Database mengembalikan result set.
6. Result set dipetakan menjadi object `Task` menggunakan `RowMapper`.
7. Object dikembalikan ke user dalam bentuk JSON.

Saya menggunakan list of objects dibanding array karena lebih mudah dipahami dan lebih terstruktur.

---

## IV. BUKTI SCREENSHOT

### Screenshot Fungsi Create

Screenshot kode yang perlu diambil:

| No | Bagian | File | Line |
|---|---|---|---|
| 1 | Class Task | `Task.java` | deklarasi field |
| 2 | RowMapper Task | `TaskRepository.java` | 27-48 |
| 3 | DTO Create | `CreateTaskRequest.java` | 6-12 |
| 4 | Service Create | `TaskService.java` | 74-100 |
| 5 | Repository Create | `TaskRepository.java` | 115-139 |

### Screenshot Fungsi Read

Screenshot kode yang perlu diambil:

| No | Bagian | File | Line |
|---|---|---|---|
| 1 | Repository Read | `TaskRepository.java` | 53-74 |
| 2 | Parameter Binding | `TaskRepository.java` | 206-231 |

### Screenshot Database

1. Struktur tabel `Task`
2. Isi tabel `Task`
3. Query `SELECT * FROM Task;`

### Screenshot API

1. `POST /api/tasks` + response
2. `GET /api/tasks` + response

### Endpoint Pengujian

```text
POST http://localhost:8080/api/tasks
```

Request body:

```json
{
  "title": "Belajar Pemrograman Basis Data",
  "description": "Membuat dokumentasi create dan read",
  "deadline": "2026-04-15T10:00:00",
  "priority": "HIGH",
  "status": "TODO",
  "estimatedDuration": 120
}
```

```text
GET http://localhost:8080/api/tasks
```

---

## V. KESIMPULAN

Aplikasi **TaskPlanner-Java-Backend** menggunakan entitas `Task`. Data dari tabel `Task` dipetakan ke class `Task` menggunakan `RowMapper`. Fitur Create menggunakan query `INSERT INTO Task` dengan placeholder `?` dan parameter binding melalui `JdbcTemplate`. Fitur Read menggunakan query `SELECT * FROM Task WHERE userId = ?` yang bersifat pasif dan non-destruktif.

Penggunaan prepared statement membuat aplikasi aman dari SQL Injection karena input user tidak digabung langsung ke query SQL.