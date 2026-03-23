package com.example.petadopt.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Application {
    private Integer id;          // 申请ID
    private Integer userId;      // 申请人ID
    private Integer petId;       // 申请宠物ID
    private String reason;       // 领养原因
    private String contactInfo;  // 联系方式（驼峰映射contact_info）
    private String status;       // 审核状态：pending/approved/rejected
    private String adminComment; // 管理员备注
    private LocalDateTime createdAt; // 申请时间
    private LocalDateTime updatedAt; // 更新时间
}