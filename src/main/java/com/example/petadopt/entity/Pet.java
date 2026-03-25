package com.example.petadopt.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data // 自动生成所有getter/setter方法
public class Pet {
    private Integer id;
    private String name;
    private String breed;
    private Integer age;
    private String gender;
    private String status; // 对应 getStatus() / setStatus()
    private String description;
    private String imageUrl;
    private LocalDateTime createTime;
}