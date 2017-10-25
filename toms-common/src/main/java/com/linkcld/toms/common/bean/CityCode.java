package com.linkcld.toms.common.bean;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;

/**
 * Created by Administrator on 2017/8/16.
 */
@JsonSerialize(include= JsonSerialize.Inclusion.NON_NULL)
@Entity
@Table(name = "T_D_CITYCODE")
public class CityCode implements Serializable {
    private static final long serialVersionUID = 5869910295828574796L;

    @Id
    @Column(name = "ID")
    private String id ;
    @Column(name = "NAME")
    private String name ;
    @Column(name = "CODE")
    private String code ;
    @Column(name = "PCODE")
    private String pcode ;
    @Column(name = "X")
    private Double x;
    @Column(name = "Y")
    private Double y;
    @Column(name = "PINYIN")
    private String pinYin;
    @Column(name = "AREA")
    private String area ;
    @Column(name = "MINX")
    private Double minx ;
    @Column(name = "MINY")
    private Double miny;
    @Column(name = "MAXX")
    private Double maxx;
    @Column(name = "MAXY")
    private Double maxy;

    public static long getSerialVersionUID() {
        return serialVersionUID;
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

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getPcode() {
        return pcode;
    }

    public void setPcode(String pcode) {
        this.pcode = pcode;
    }

    public Double getX() {
        return x;
    }

    public void setX(Double x) {
        this.x = x;
    }

    public Double getY() {
        return y;
    }

    public void setY(Double y) {
        this.y = y;
    }

    public String getPinYin() {
        return pinYin;
    }

    public void setPinYin(String pinYin) {
        this.pinYin = pinYin;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public Double getMinx() {
        return minx;
    }

    public void setMinx(Double minx) {
        this.minx = minx;
    }

    public Double getMiny() {
        return miny;
    }

    public void setMiny(Double miny) {
        this.miny = miny;
    }

    public Double getMaxx() {
        return maxx;
    }

    public void setMaxx(Double maxx) {
        this.maxx = maxx;
    }

    public Double getMaxy() {
        return maxy;
    }

    public void setMaxy(Double maxy) {
        this.maxy = maxy;
    }

    @Override
    public String toString() {
        return "Region [ name=" + name + ", code=" + code + ", pcode=" + pcode
                + ", x=" + x + ", y=" + y + ", pinYin=" + pinYin + ", area="
                + area + "]";
    }
}
