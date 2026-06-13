package com.taskplanner.dto;

import java.util.List;

/**
 * Paginated API Response DTO
 */
public class PaginatedResponse<T> {
    private Boolean success;
    private String message;
    private List<T> data;
    private PaginationInfo pagination;
    private String timestamp;

    public static class PaginationInfo {
        private Integer page;
        private Integer limit;
        private Integer total;
        private Integer totalPages;
        private Boolean hasNextPage;
        private Boolean hasPrevPage;

        public PaginationInfo() {
        }

        public PaginationInfo(Integer page, Integer limit, Integer total, Integer totalPages,
                              Boolean hasNextPage, Boolean hasPrevPage) {
            this.page = page;
            this.limit = limit;
            this.total = total;
            this.totalPages = totalPages;
            this.hasNextPage = hasNextPage;
            this.hasPrevPage = hasPrevPage;
        }

        public Integer getPage() {
            return page;
        }

        public void setPage(Integer page) {
            this.page = page;
        }

        public Integer getLimit() {
            return limit;
        }

        public void setLimit(Integer limit) {
            this.limit = limit;
        }

        public Integer getTotal() {
            return total;
        }

        public void setTotal(Integer total) {
            this.total = total;
        }

        public Integer getTotalPages() {
            return totalPages;
        }

        public void setTotalPages(Integer totalPages) {
            this.totalPages = totalPages;
        }

        public Boolean getHasNextPage() {
            return hasNextPage;
        }

        public void setHasNextPage(Boolean hasNextPage) {
            this.hasNextPage = hasNextPage;
        }

        public Boolean getHasPrevPage() {
            return hasPrevPage;
        }

        public void setHasPrevPage(Boolean hasPrevPage) {
            this.hasPrevPage = hasPrevPage;
        }
    }

    public PaginatedResponse() {
    }

    public PaginatedResponse(Boolean success, String message, List<T> data, PaginationInfo pagination,
                             String timestamp) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.pagination = pagination;
        this.timestamp = timestamp;
    }

    public PaginatedResponse(Boolean success, String message, List<T> data, PaginationInfo pagination) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.pagination = pagination;
        this.timestamp = java.time.LocalDateTime.now().toString();
    }

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<T> getData() {
        return data;
    }

    public void setData(List<T> data) {
        this.data = data;
    }

    public PaginationInfo getPagination() {
        return pagination;
    }

    public void setPagination(PaginationInfo pagination) {
        this.pagination = pagination;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
