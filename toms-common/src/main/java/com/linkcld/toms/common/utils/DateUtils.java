package com.linkcld.toms.common.utils;

/**
 * Created by shitou on 2017/7/18.
 */
import java.text.ParseException;
import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Locale;

public final class DateUtils {
    public static String DateYMdHmsS = "yyyy-MM-dd HH:mm:ss.S";
    public static String DateYMdHms = "yyyy-MM-dd HH:mm:ss";
    public static String DateYMdHm = "yyyy-MM-dd HH:mm";
    public static String DateYMdH = "yyyy-MM-dd HH";
    public static String DateYMd = "yyyy-MM-dd";
    public static String DateHms = "HH:mm:ss";
    public static String DateHmsS = "HH:mm:ss.S";
    public static String DateNoSpaceMarkYMdHmsS = "yyyyMMddHHmmssS";
    public static String DateNoSpaceMarkYMdHms = "yyyyMMddHHmmss";
    public static String DateNoSpaceMarkYMdHm = "yyyyMMddHHmm";
    public static String DateNoSpaceMarkYMdH = "yyyyMMddHH";
    public static String DateNoSpaceMarkYMd = "yyyyMMdd";
    public static String DateY = "yyyy";
    public static String dateYM = "yyyy-MM";

    private DateUtils() {
    }

    public static String[] getDaysBetweenToStrArray(String begDate, String endDate, String strDateFormat) throws ParseException {
        if(begDate != null && endDate != null) {
            Date date1 = parseStrToDate(begDate, strDateFormat);
            Date date2 = parseStrToDate(endDate, strDateFormat);
            return getDaysBetweenToStrArray(date1, date2, strDateFormat);
        } else {
            throw new IllegalArgumentException("The begDate and endDate must not be null");
        }
    }

    public static String[] getDaysBetweenToStrArray(Date begDate, Date endDate, String strDateFormat) {
        if(begDate != null && endDate != null) {
            if(isSameDay(begDate, endDate)) {
                throw new IllegalArgumentException("The begDate equal endDate");
            } else if(isAfterDay(begDate, endDate)) {
                throw new IllegalArgumentException("The begDate after endDate");
            } else {
                long days = getDaysBetweenToLong(begDate, endDate) + 1L;
                String[] strResult = new String[(int)days];
                Calendar cal = Calendar.getInstance();
                cal.setTime(begDate);
                strResult[0] = parseDateToStr(cal.getTime(), strDateFormat);

                for(int i = 1; (long)i < days; ++i) {
                    strResult[i] = getAddDayToStr((Calendar)cal, 1, strDateFormat);
                }

                return strResult;
            }
        } else {
            throw new IllegalArgumentException("The begDate and endDate must not be null");
        }
    }

    public static boolean isAfterDay(Date date1, Date date2) {
        if(date1 != null && date2 != null) {
            Calendar cal1 = Calendar.getInstance();
            cal1.setTime(date1);
            Calendar cal2 = Calendar.getInstance();
            cal2.setTime(date2);
            return isAfterDay(cal1, cal2);
        } else {
            throw new IllegalArgumentException("The date1 and date2 must not be null");
        }
    }

    public static boolean isAfterDay(Calendar cal1, Calendar cal2) {
        if(cal1 != null && cal2 != null) {
            byte YEAR = 1;
            byte DAY_OF_YEAR = 6;
            return cal1.get(YEAR) > cal2.get(YEAR) || cal1.get(DAY_OF_YEAR) > cal2.get(DAY_OF_YEAR);
        } else {
            throw new IllegalArgumentException("The date must not be null");
        }
    }

    public static long getDaysBetweenToLong(Date begDate, Date endDate) {
        long beginTime = begDate.getTime();
        long endTime = endDate.getTime();
        long days = (long)((double)((endTime - beginTime) / 86400000L) + 0.5D);
        return days;
    }

    public static String getAddDayToStr(Date date, int day, String strDateFormat) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        return getAddDayToStr(cal, day, strDateFormat);
    }

    public static String getAddDayToStr(Calendar cal, int day, String strDateFormat) {
        cal.add(5, day);
        return parseDateToStr(cal.getTime(), strDateFormat);
    }

    public static Date getAddDayToDate(Date date, int day) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(5, day);
        return cal.getTime();
    }

    public static String getNowDateStr(String strDateFormat) {
        if(strDateFormat == null || "".equals(strDateFormat)) {
            strDateFormat = DateYMdHms;
        }

        return parseDateToStr(new Date(), strDateFormat);
    }

    public static String parseDateToStr(Date date, String strDateFormat) {
        SimpleDateFormat format = new SimpleDateFormat(strDateFormat);
        return format.format(date);
    }

    public static boolean isSameDay(Date date1, Date date2) {
        if(date1 != null && date2 != null) {
            Calendar cal1 = Calendar.getInstance();
            cal1.setTime(date1);
            Calendar cal2 = Calendar.getInstance();
            cal2.setTime(date2);
            return isSameDay(cal1, cal2);
        } else {
            throw new IllegalArgumentException("The date must not be null");
        }
    }

    public static boolean isSameDay(Calendar cal1, Calendar cal2) {
        if(cal1 != null && cal2 != null) {
            byte AM = 0;
            byte YEAR = 1;
            byte DAY_OF_YEAR = 6;
            return cal1.get(AM) == cal2.get(AM) && cal1.get(YEAR) == cal2.get(YEAR) && cal1.get(DAY_OF_YEAR) == cal2.get(DAY_OF_YEAR);
        } else {
            throw new IllegalArgumentException("The date must not be null");
        }
    }

    public static Date parseStrToDate(String str) throws ParseException {
        String[] parsePatterns = new String[]{DateYMd, DateYMdH, DateYMdHm, DateYMdHms};
        return parseStrToDate(str, parsePatterns);
    }

    public static Date parseStrToDate(String str, String strDateFormat) throws ParseException {
        if(str != null && strDateFormat != null && !"".equals(str) && !"".equals(strDateFormat)) {
            SimpleDateFormat parser = new SimpleDateFormat(strDateFormat);
            ParsePosition pos = new ParsePosition(0);
            Date date = parser.parse(str, pos);
            if(date != null && pos.getIndex() == str.length()) {
                return date;
            } else {
                throw new ParseException("Unable to parse the date: " + str, -1);
            }
        } else {
            throw new IllegalArgumentException("Date and Patterns must not be null");
        }
    }

    public static Date parseStrToDate(String str, String[] parsePatterns) throws ParseException {
        if(str != null && parsePatterns != null) {
            SimpleDateFormat parser = null;
            ParsePosition pos = new ParsePosition(0);

            for(int i = 0; i < parsePatterns.length; ++i) {
                if(i == 0) {
                    parser = new SimpleDateFormat(parsePatterns[0]);
                } else {
                    parser.applyPattern(parsePatterns[i]);
                }

                pos.setIndex(0);
                Date date = parser.parse(str, pos);
                if(date != null && pos.getIndex() == str.length()) {
                    return date;
                }
            }

            throw new ParseException("Unable to parse the date: " + str, -1);
        } else {
            throw new IllegalArgumentException("Date and Patterns must not be null");
        }
    }

    public static long DaysBetween(Date bgdate, Date enddate) {
        long beginTime = bgdate.getTime();
        long endTime = enddate.getTime();
        long days = (long)((double)((endTime - beginTime) / 86400000L) + 0.5D);
        return days;
    }

    public static long HoursBetween(Date bgdate, Date enddate) {
        long beginTime = bgdate.getTime();
        long endTime = enddate.getTime();
        long hours = (endTime - beginTime) / 3600000L;
        return hours;
    }

    public static long getTwoMinutes(Date bgdate, Date enddate) {
        long beginTime = bgdate.getTime();
        long endTime = enddate.getTime();
        long Minutes = (endTime - beginTime) / 60000L;
        return Minutes;
    }

    public static Date addDate(Date date, int hour) {
        Calendar c = Calendar.getInstance();
        c.setTimeInMillis(getMillis(date) + (long)hour * 3600L * 1000L);
        return c.getTime();
    }

    public static long getMillis(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        return calendar.getTimeInMillis();
    }

    public static String getPreTime(String sj1, String jj) {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String mydate1 = "";

        try {
            Date e = format.parse(sj1);
            long Time = e.getTime() / 1000L + (long)(Integer.parseInt(jj) * 60);
            e.setTime(Time * 1000L);
            mydate1 = format.format(e);
        } catch (Exception var7) {
            ;
        }

        return mydate1;
    }

    public static boolean isLeapYear(Date date) {
        GregorianCalendar gc = (GregorianCalendar)Calendar.getInstance();
        gc.setTime(date);
        return isLeapYear((Calendar)gc);
    }

    public static boolean isLeapYear(Calendar date) {
        int year = date.get(1);
        return year % 4 == 0 && year % 100 != 0 || year % 400 == 0;
    }

    public static Date getLastDateOfMonth(int year, int month) {
        Calendar calendar = Calendar.getInstance();
        calendar.set(1, year);
        --month;
        calendar.set(2, month);
        int end = calendar.getActualMaximum(5);
        calendar.set(5, end);
        return calendar.getTime();
    }

    public static Date getFirstDateOfMonth(int year, int month) {
        Calendar calendar = Calendar.getInstance();
        calendar.set(1, year);
        --month;
        calendar.set(2, month);
        int begin = calendar.getActualMinimum(5);
        calendar.set(5, begin);
        return calendar.getTime();
    }

    public static int getMaxWeekNumOfYear(int year) {
        Calendar calendar = Calendar.getInstance();
        calendar.set(year, 11, 31, 23, 59, 59);
        return getWeekOfYear(calendar.getTime());
    }

    public static int getWeekOfYear(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setFirstDayOfWeek(2);
        calendar.setMinimalDaysInFirstWeek(7);
        calendar.setTime(date);
        return calendar.get(3);
    }

    public static Date getFirstDayOfWeek(int year, int week) {
        Calendar calendar = Calendar.getInstance();
        calendar.set(1, year);
        calendar.set(2, 0);
        calendar.set(5, 1);
        calendar.add(5, week * 7);
        return getFirstDayOfWeek(calendar.getTime());
    }

    public static Date getLastDayOfWeek(int year, int week) {
        Calendar calendar = Calendar.getInstance();
        calendar.set(1, year);
        calendar.set(2, 0);
        calendar.set(5, 1);
        calendar.add(5, week * 7);
        return getLastDayOfWeek(calendar.getTime());
    }

    public static Date getFirstDayOfWeek(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setFirstDayOfWeek(2);
        calendar.setTime(date);
        calendar.set(7, calendar.getFirstDayOfWeek());
        return calendar.getTime();
    }

    public static Date getLastDayOfWeek(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setFirstDayOfWeek(2);
        calendar.setTime(date);
        calendar.set(7, calendar.getFirstDayOfWeek() + 6);
        return calendar.getTime();
    }

    public static boolean isSameWeekDates(Date date1, Date date2) {
        Calendar cal1 = Calendar.getInstance();
        Calendar cal2 = Calendar.getInstance();
        cal1.setTime(date1);
        cal2.setTime(date2);
        int subYear = cal1.get(1) - cal2.get(1);
        if(0 == subYear) {
            if(cal1.get(3) == cal2.get(3)) {
                return true;
            }
        } else if(1 == subYear && 11 == cal2.get(2)) {
            if(cal1.get(3) == cal2.get(3)) {
                return true;
            }
        } else if(-1 == subYear && 11 == cal1.get(2) && cal1.get(3) == cal2.get(3)) {
            return true;
        }

        return false;
    }

    public static String getSeqWeek() {
        Calendar c = Calendar.getInstance(Locale.CHINA);
        String week = Integer.toString(c.get(3));
        if(week.length() == 1) {
            week = "0" + week;
        }

        String year = Integer.toString(c.get(1));
        return year + week;
    }

    public static String getWeek(String sdate, String num) {
        Date dd = null;

        try {
            dd = parseStrToDate(sdate);
        } catch (ParseException var4) {
            var4.printStackTrace();
        }

        Calendar c = Calendar.getInstance();
        c.setTime(dd);
        if(num.equals("1")) {
            c.set(7, 2);
        } else if(num.equals("2")) {
            c.set(7, 3);
        } else if(num.equals("3")) {
            c.set(7, 4);
        } else if(num.equals("4")) {
            c.set(7, 5);
        } else if(num.equals("5")) {
            c.set(7, 6);
        } else if(num.equals("6")) {
            c.set(7, 7);
        } else if(num.equals("0")) {
            c.set(7, 1);
        }

        return (new SimpleDateFormat("yyyy-MM-dd")).format(c.getTime());
    }

    public static String getWeek(String sdate) {
        try {
            Date e = parseStrToDate(sdate);
            Calendar c = Calendar.getInstance();
            c.setTime(e);
            return (new SimpleDateFormat("EEEE")).format(c.getTime());
        } catch (ParseException var3) {
            var3.printStackTrace();
            return null;
        }
    }

    public static String getWeekStr(String sdate) {
        String str = "";
        str = getWeek(sdate);
        if("1".equals(str)) {
            str = "星期日";
        } else if("2".equals(str)) {
            str = "星期一";
        } else if("3".equals(str)) {
            str = "星期二";
        } else if("4".equals(str)) {
            str = "星期三";
        } else if("5".equals(str)) {
            str = "星期四";
        } else if("6".equals(str)) {
            str = "星期五";
        } else if("7".equals(str)) {
            str = "星期六";
        }

        return str;
    }

    public static long getDays(String date1, String date2) {
        if(date1 != null && !date1.equals("")) {
            if(date2 != null && !date2.equals("")) {
                SimpleDateFormat myFormatter = new SimpleDateFormat("yyyy-MM-dd");
                Date date = null;
                Date mydate = null;

                try {
                    date = myFormatter.parse(date1);
                    mydate = myFormatter.parse(date2);
                } catch (Exception var7) {
                    ;
                }

                long day = (date.getTime() - mydate.getTime()) / 86400000L;
                return day;
            } else {
                return 0L;
            }
        } else {
            return 0L;
        }
    }

    public static String getNowMonth(String sdate) {
        try {
            sdate = sdate.substring(0, 8) + "01";
            Date e = parseStrToDate(sdate);
            Calendar c = Calendar.getInstance();
            c.setTime(e);
            int u = c.get(7);
            String newday = getAddDayToStr(new Date(), 1 - u, sdate);
            return newday;
        } catch (ParseException var5) {
            var5.printStackTrace();
            return null;
        }
    }

    public static boolean RightDate(String date) {
        new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        if(date == null) {
            return false;
        } else {
            SimpleDateFormat sdf;
            if(date.length() > 10) {
                sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
            } else {
                sdf = new SimpleDateFormat("yyyy-MM-dd");
            }

            try {
                sdf.parse(date);
                return true;
            } catch (ParseException var3) {
                return false;
            }
        }
    }
}