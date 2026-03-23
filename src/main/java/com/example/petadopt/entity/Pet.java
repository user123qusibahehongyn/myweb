package com.example.petadopt.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Pet {
    private Integer id;          // 宠物ID
    private String name;         // 宠物名字
    private String breed;        // 品种
    private Integer age;         // 年龄（岁）
    private String gender;       // 性别：male/female
    private String intro;        // 宠物介绍
    private String image;        // 图片路径
    private String status;       // 状态：available/pending/adopted
    private String healthStatus; // 健康状况（驼峰映射health_status）
    private LocalDateTime createdAt; // 入库时间
}