package com.example.petadopt.mapper;

import com.example.petadopt.entity.AdoptApply;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface AdoptApplyMapper {
    AdoptApply selectAdoptApplyById(Long id);
    List<AdoptApply> selectAdoptApplyList();
    int insertAdoptApply(AdoptApply adoptApply);
    int updateAdoptApply(AdoptApply adoptApply);
    int deleteAdoptApplyById(Long id);
}