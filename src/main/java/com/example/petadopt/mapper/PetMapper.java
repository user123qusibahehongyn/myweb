package com.example.petadopt.mapper;

import com.example.petadopt.entity.Pet;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface PetMapper {
    // 查询所有可领养宠物（status=available）
    @Select("SELECT * FROM pet WHERE status = 'available'")
    List<Pet> findAvailablePets();

    // 根据ID查宠物
    @Select("SELECT * FROM pet WHERE id = #{id}")
    Pet findPetById(Integer id);

    // 新增宠物
    @Insert("INSERT INTO pet(name, breed, age, gender, intro, image, status, health_status) " +
            "VALUES(#{name}, #{breed}, #{age}, #{gender}, #{intro}, #{image}, #{status}, #{healthStatus})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertPet(Pet pet);

    // 更新宠物状态
    @Update("UPDATE pet SET status = #{status} WHERE id = #{id}")
    int updatePetStatus(@Param("id") Integer id, @Param("status") String status);

    // 查询所有宠物（含所有状态）
    @Select("SELECT * FROM pet")
    List<Pet> findAllPets();
}