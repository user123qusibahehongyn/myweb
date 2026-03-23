package com.example.petadopt.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AdoptionHistory {
    private Integer id;          // 历史ID
    private Integer userId;      // 用户ID
    private Integer petId;       // 宠物ID
    private LocalDateTime adoptionDate; // 领养时间
    private String feedback;     // 领养反馈
}