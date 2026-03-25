package com.example.petadopt.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data // 自动生成所有getter/setter方法
public class AdoptionHistory {
    private Integer id;
    private Integer userId;
    private Integer petId;
    private LocalDateTime adoptionDate;
    private String feedback;
}