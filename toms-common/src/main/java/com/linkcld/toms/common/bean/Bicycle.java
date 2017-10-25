package com.linkcld.toms.common.bean;

/**
 * Created by admin on 2016/9/19.
 */

public class Bicycle {
    private String id;
    private String name;
    private Double y;
    private Double x;
    private Long capacity;
    private Long availbike;
    private Double unavailbike;
    private Double availbikeRate;
    private Double unavailbikeRate;
    private String address;
    private String createtime;
    private Double distance;

    private String scode;
    private String xcode;
    private String pcode;


    public String getScode() {
        return scode;
    }

    public void setScode(String scode) {
        this.scode = scode;
    }

    public String getXcode() {
        return xcode;
    }

    public void setXcode(String xcode) {
        this.xcode = xcode;
    }

    public String getPcode() {
        return pcode;
    }

    public void setPcode(String pcode) {
        this.pcode = pcode;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getY() {
        return y;
    }

    public void setY(Double y) {
        this.y = y;
    }

    public Double getX() {
        return x;
    }

    public void setX(Double x) {
        this.x = x;
    }

    public Long getCapacity() {
        return capacity;
    }

    public void setCapacity(Long capacity) {
        this.capacity = capacity;
    }

    public Long getAvailbike() {
        return availbike;
    }

    public void setAvailbike(Long availbike) {
        this.availbike = availbike;
    }

    public Double getUnavailbike() {
        return unavailbike;
    }

    public void setUnavailbike(Double unavailbike) {
        this.unavailbike = unavailbike;
    }

    public Double getAvailbikeRate() {
        return availbikeRate;
    }

    public void setAvailbikeRate(Double availbikeRate) {
        this.availbikeRate = availbikeRate;
    }

    public Double getUnavailbikeRate() {
        return unavailbikeRate;
    }

    public void setUnavailbikeRate(Double unavailbikeRate) {
        this.unavailbikeRate = unavailbikeRate;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCreatetime() {
        return createtime;
    }

    public void setCreatetime(String createtime) {
        this.createtime = createtime;
    }

    public Double getDistance() {
        return distance;
    }

    public void setDistance(Double distance) {
        this.distance = distance;
    }
}
