package com.example.petadopt.mapper;

import com.example.petadopt.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {

    /**
     * 根据用户名和密码查询用户
     * @param username 用户名
     * @param password 密码
     * @return 用户对象
     */
    User selectByUsernameAndPassword(
            @Param("username") String username,
            @Param("password") String password
    );

    /**
     * 插入新用户（注册）
     * @param user 用户信息
     * @return 受影响行数
     */
    int insertUser(User user);
}