package com.example.petadopt.controller;

import com.example.petadopt.entity.Application;
import com.example.petadopt.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/application")
public class ApplicationController {
    @Autowired
    private ApplicationService applicationService;

    // 提交领养申请
    @PostMapping
    public String submitApplication(@RequestBody Application application) {
        boolean success = applicationService.submitApplication(application);
        return success ? "{\"code\":1,\"msg\":\"申请提交成功\",\"data\":null}" : "{\"code\":0,\"msg\":\"提交失败\",\"data\":null}";
    }

    // 查询用户申请记录
    @GetMapping("/user/{userId}")
    public String getUserApplications(@PathVariable Integer userId) {
        List<Application> apps = applicationService.getUserApplications(userId);
        return String.format("{\"code\":1,\"msg\":\"成功\",\"data\":%s}", apps);
    }

    // 审核申请（管理员操作）
    @PutMapping("/audit/{id}")
    public String auditApplication(@PathVariable Integer id, @RequestParam String status, @RequestParam(required = false) String adminComment) {
        boolean success = applicationService.auditApplication(id, status, adminComment);
        return success ? "{\"code\":1,\"msg\":\"审核完成\",\"data\":null}" : "{\"code\":0,\"msg\":\"审核失败\",\"data\":null}";
    }
}