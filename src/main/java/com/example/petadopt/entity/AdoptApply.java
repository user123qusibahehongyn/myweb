package com.example.petadopt.entity;

import java.time.LocalDateTime;

public class AdoptApply {
    private Long id;
    private Long petId;
    private String userName;
    private String userPhone;
    private String userWechat;
    private String applyReason;
    private LocalDateTime createTime;

    // Getter 和 Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getPetId() { return petId; }
    public void setPetId(Long petId) { this.petId = petId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getUserPhone() { return userPhone; }
    public void setUserPhone(String userPhone) { this.userPhone = userPhone; }
    public String getUserWechat() { return userWechat; }
    public void setUserWechat(String userWechat) { this.userWechat = userWechat; }
    public String getApplyReason() { return applyReason; }
    public void setApplyReason(String applyReason) { this.applyReason = applyReason; }
    public LocalDateTime getCreateTime() { return createTime; }
    public void setCreateTime(LocalDateTime createTime) { this.createTime = createTime; }
}