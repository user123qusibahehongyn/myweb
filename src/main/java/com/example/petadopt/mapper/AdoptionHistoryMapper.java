package com.example.petadopt.mapper;

import com.example.petadopt.entity.AdoptionHistory;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface AdoptionHistoryMapper {
    // 新增领养历史（审核通过后）
    @Insert("INSERT INTO adoption_history(user_id, pet_id, adoption_date, feedback) " +
            "VALUES(#{userId}, #{petId}, #{adoptionDate}, #{feedback})")
    int insertAdoptionHistory(AdoptionHistory history);

    // 根据用户ID查领养历史
    @Select("SELECT * FROM adoption_history WHERE user_id = #{userId}")
    List<AdoptionHistory> findHistoryByUserId(Integer userId);
}