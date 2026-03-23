package com.example.petadopt.service;

import com.example.petadopt.entity.AdoptionHistory;
import com.example.petadopt.mapper.AdoptionHistoryMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdoptionHistoryService {
    @Autowired
    private AdoptionHistoryMapper adoptionHistoryMapper;

    // 新增领养历史
    public boolean addAdoptionHistory(Integer userId, Integer petId, String feedback) {
        AdoptionHistory history = new AdoptionHistory();
        history.setUserId(userId);
        history.setPetId(petId);
        history.setAdoptionDate(LocalDateTime.now());
        history.setFeedback(feedback);
        return adoptionHistoryMapper.insertAdoptionHistory(history) > 0;
    }

    // 查询用户领养历史
    public List<AdoptionHistory> getUserAdoptionHistory(Integer userId) {
        return adoptionHistoryMapper.findHistoryByUserId(userId);
    }
}