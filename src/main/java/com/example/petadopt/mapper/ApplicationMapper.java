package com.example.petadopt.mapper;

import com.example.petadopt.entity.Application;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ApplicationMapper {
    // 提交领养申请
    @Insert("INSERT INTO application(user_id, pet_id, reason, contact_info) " +
            "VALUES(#{userId}, #{petId}, #{reason}, #{contactInfo})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertApplication(Application application);

    // 根据用户ID查申请记录
    @Select("SELECT * FROM application WHERE user_id = #{userId}")
    List<Application> findApplicationsByUserId(Integer userId);

    // 根据申请ID更新审核状态
    @Update("UPDATE application SET status = #{status}, admin_comment = #{adminComment} WHERE id = #{id}")
    int updateApplicationStatus(@Param("id") Integer id, @Param("status") String status, @Param("adminComment") String adminComment);

    // 根据宠物ID查申请记录
    @Select("SELECT * FROM application WHERE pet_id = #{petId}")
    List<Application> findApplicationsByPetId(Integer petId);
}