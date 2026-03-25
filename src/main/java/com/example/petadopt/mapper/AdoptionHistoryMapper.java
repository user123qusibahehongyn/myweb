package com.example.petadopt.mapper;

import com.example.petadopt.entity.AdoptionHistory;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface AdoptionHistoryMapper {
    int insertAdoptionHistory(AdoptionHistory history);
    List<AdoptionHistory> findHistoryByUserId(@Param("userId") Integer userId);
}