package com.example.petadopt.service;

import com.example.petadopt.entity.Application;
import com.example.petadopt.mapper.ApplicationMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {
    @Autowired
    private ApplicationMapper applicationMapper;

    // 提交领养申请
    public boolean submitApplication(Application application) {
        // 默认状态为pending
        application.setStatus("pending");
        return applicationMapper.insertApplication(application) > 0;
    }

    // 查询用户所有申请记录
    public List<Application> getUserApplications(Integer userId) {
        return applicationMapper.findApplicationsByUserId(userId);
    }

    // 审核领养申请（管理员操作）
    public boolean auditApplication(Integer id, String status, String adminComment) {
        return applicationMapper.updateApplicationStatus(id, status, adminComment) > 0;
    }

    // 查询宠物的申请记录
    public List<Application> getPetApplications(Integer petId) {
        return applicationMapper.findApplicationsByPetId(petId);
    }
}