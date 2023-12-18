package com.core.domain.models;

public enum UserType {
    STUDENT("student"),
    SERVER("server"),
    ADMIN("admin");

    private final String type;

    UserType(String type) {
        this.type = type;
    }

    public String toString() {
        return this.type;
    }
}
