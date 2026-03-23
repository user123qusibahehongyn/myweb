package com.example.petadopt;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.example.petadopt.mapper") // 这行要加！扫描 Mapper 接口
public class PetAdoptApplication {
    public static void main(String[] args) {
        SpringApplication.run(PetAdoptApplication.class, args);
    }
}