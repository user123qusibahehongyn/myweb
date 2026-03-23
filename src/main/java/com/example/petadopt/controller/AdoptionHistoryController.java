package com.example.petadopt.controller;

import com.example.petadopt.service.AdoptionHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/history")
public class AdoptionHistoryController {
    @Autowired
    private AdoptionHistoryService adoptionHistoryService;

    // 新增领养历史（审核通过后调用）
    @PostMapping
    public String addAdoptionHistory(@RequestParam Integer userId, @RequestParam Integer petId, @RequestParam String feedback) {
        boolean success = adoptionHistoryService.addAdoptionHistory(userId, petId, feedback);
        return success ? "{\"code\":1,\"msg\":\"历史记录新增成功\",\"data\":null}" : "{\"code\":0,\"msg\":\"新增失败\",\"data\":null}";
    }

    // 查询用户领养历史
    @GetMapping("/user/{userId}")
    public String getUserHistory(@PathVariable Integer userId) {
        return String.format("{\"code\":1,\"msg\":\"成功\",\"data\":%s}", adoptionHistoryService.getUserAdoptionHistory(userId));
    }
}