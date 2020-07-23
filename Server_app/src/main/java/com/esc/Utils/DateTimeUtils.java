/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.esc.Utils;

import com.esc.restfull.AccountController;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;
import org.apache.logging.log4j.LogManager;

/**
 *
 * @author nguye
 */
public class DateTimeUtils {
    
    public static final org.apache.logging.log4j.Logger logger = LogManager.getLogger(DateTimeUtils.class);
    
    public DateTimeUtils() {
    }

    public static Date convertStringToTime(String date, String pattern) {
        SimpleDateFormat dateFormat = new SimpleDateFormat(pattern);
        try {
            return dateFormat.parse(date);

        } catch (Exception e) {
            logger.error("Error when convertStringToTime", e);
        }
        return null;
    }

    public static Date convertStringToDate(String date) throws Exception {
        //String pattern = "dd/MM/yyyy";
        String pattern = "yyyy-MM-dd";
        return convertStringToTime(date, pattern);
    }

    public static String convertDateToString(Date date, String pattern) {
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat(pattern); //"dd/MM/yyyy"
            if (date == null) {
                return "";
            }
            return dateFormat.format(date);
        } catch (Exception e) {
            logger.error("Have Error", e);
        }
        return "";
    }

    public static Date convertStringToDate(String date, String pattern) {
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat(pattern); //"dd/MM/yyyy"
            if (date == null) {
                return null;
            }
            return dateFormat.parse(date);
        } catch (Exception e) {
            logger.error("Have Error", e);
        }
        return null;
    }

    public static String convertDateToString(Date date) throws Exception {
        return convertDateToString(date, "yyyy-MM-dd");
    }

    /*
     *  @author: dungnt
     *  @todo: get sysdate
     *  @return: String sysdate
     */
    public static String getSysdate() throws Exception {
        Calendar calendar = Calendar.getInstance();
        return convertDateToString(calendar.getTime());
    }

    /*
     *  @author: dungnt
     *  @todo: get sysdate detail
     *  @return: String sysdate
     */
    public static String getSysDateTime() throws Exception {
        Calendar calendar = Calendar.getInstance();
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
        try {
            return dateFormat.format(calendar.getTime());
        } catch (Exception e) {
            throw e;
        }
    }

    /*
     *  @author: ThanhNC
     *  @todo: get sysdate detail formated in pattern
     *  @return: String sysdate
     */
    public static String getSysDateTime(String pattern) throws Exception {
        Calendar calendar = Calendar.getInstance();
        SimpleDateFormat dateFormat = new SimpleDateFormat(pattern);
        try {
            return dateFormat.format(calendar.getTime());
        } catch (Exception e) {
            throw e;
        }
    }

    /*
     *  @author: dungnt
     *  @todo: convert from String to DateTime detail
     *  @param: String date
     *  @return: Date
     */
    public static Date convertStringToDateTime(String date) throws Exception {
        String pattern = "dd/MM/yyyy HH:mm:ss";
        return convertStringToTime(date, pattern);
    }

    public static String convertDateTimeToString(Date date) throws Exception {
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        try {
            return dateFormat.format(date);
        } catch (Exception e) {
            throw e;
        }
    }

    /**
     * @author: ThangPV
     * @param utilDate
     * @return
     * @todo: convert from java.util.Date to java.sql.Date
     */
    public static java.sql.Date convertToSqlDate(java.util.Date utilDate) {
        return new java.sql.Date(utilDate.getTime());
    }

    /**
     * @param monthInput
     * @anhlt - Get the first day on month selected.
     * @return
     */
    public static String parseDate(int monthInput) {
        String dateReturn = "01/01/";
        Calendar cal = Calendar.getInstance();
        switch (monthInput) {
            case 1:
                dateReturn = "01/01/";
                break;
            case 2:
                dateReturn = "01/02/";
                break;
            case 3:
                dateReturn = "01/03/";
                break;
            case 4:
                dateReturn = "01/04/";
                break;
            case 5:
                dateReturn = "01/05/";
                break;
            case 6:
                dateReturn = "01/06/";
                break;
            case 7:
                dateReturn = "01/07/";
                break;
            case 8:
                dateReturn = "01/08/";
                break;
            case 9:
                dateReturn = "01/09/";
                break;
            case 10:
                dateReturn = "01/10/";
                break;
            case 11:
                dateReturn = "01/11/";
                break;
            case 12:
                dateReturn = "01/12/";
                break;
        }
        return dateReturn + cal.get(Calendar.YEAR);
    }

    public static Date getFirstDayOfCurrentMonth() {
        //Using for get first day of the current month
        Calendar cal = Calendar.getInstance();
        cal.set(cal.get(Calendar.YEAR), cal.get(Calendar.MONTH), cal.get(Calendar.DATE));
        cal.set(Calendar.DAY_OF_MONTH, cal.getActualMinimum(Calendar.DAY_OF_MONTH));
        return cal.getTime();
    }

    public static Date getFirstDayOfMonthBefore() {
        //Using for get first day of the month before
        Calendar cal = Calendar.getInstance();
        cal.set(cal.get(Calendar.YEAR), cal.get(Calendar.MONTH) - 1, cal.get(Calendar.DATE));
        cal.set(Calendar.DAY_OF_MONTH, cal.getActualMinimum(Calendar.DAY_OF_MONTH));
        return cal.getTime();
    }

    public static Date getMaxDate(Date date1, Date date2) {
        if (date1 != null && date2 != null) {
            if (date1.before(date2)) {
                return date2;
            } else {
                return date1;
            }
        } else if (date1 == null && date2 == null) {
            return date1;
        } else {
            return null;
        }
    }

    public static Date getMinDate(Date date1, Date date2) {
        if (date1 != null && date2 != null) {
            if (date1.before(date2)) {
                return date1;
            } else {
                return date2;
            }
        } else if (date1 == null && date2 == null) {
            return date1;
        } else {
            return null;
        }
    }

    /**
     * @author HuyPQ15
     * @param time
     * @return true if timePattern is correct other return false
     * @description timePattern is formated: HH:mm
     */
    public static boolean validateTime(String time) {
        try {
            if (time.length() != 5) {
                return false;
            }

            String[] dateSplit = time.split(":");
            //validate hour
            int numTemp = Integer.parseInt(dateSplit[0]);
            if (numTemp < 0 || numTemp > 23) {
                return false;
            }

            //validate minute
            numTemp = Integer.parseInt(dateSplit[1]);
            return !(numTemp < 0 || numTemp > 59);
        } catch (Exception e) {
            logger.error("Have Error", e);
        }
        return false;
    }

    /**
     * true if current time is between from time and to time other return fail
     *
     * @param fromTimeS
     * @param toTimeSet
     * @return
     * @throws Exception
     */
    public static boolean checkCurrentTimeBetween(String fromTimeS, String toTimeSet) throws Exception {

        //validate from time and to time
        if (!validateTime(fromTimeS)) {
            return false;
        }
        if (!validateTime(toTimeSet)) {
            return false;
        }
        Date timeNow = new Date();
        String today = DateTimeUtils.convertDateToString(timeNow, "yyyyMMdd");
        /*String today = calendar.get(Calendar.YEAR) + ""
         + (calendar.get(Calendar.MONTH) + 1) + ""
         + calendar.get(Calendar.DAY_OF_MONTH);*/
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMddHH:mm");

        Date fromTimeTemp = simpleDateFormat.parse(today + fromTimeS);  //date convert from param table
        Date toTimeTemp = simpleDateFormat.parse(today + toTimeSet);      //date convert from param table

        //check time fromDate and time toDate
        if (fromTimeTemp.before(toTimeTemp)) { // if from time < to time download in a day
            if (timeNow.before(toTimeTemp) && timeNow.after(fromTimeTemp)) {
                return true;
            }
        } else if (fromTimeTemp.after(toTimeTemp)) {

//            if (timeNow.before(new Date(toTimeTemp.getTime()+24*60*60*1000)) && timeNow.after(fromTimeTemp)) {
//                return true;
//            }
            Date toTime1 = simpleDateFormat.parse(today + "24:00");
            Date fromTime1 = simpleDateFormat.parse(today + "00:00");
            if ((timeNow.before(toTime1) && timeNow.after(fromTimeTemp)) || (timeNow.before(toTimeTemp) && timeNow.after(fromTime1))) {
                return true;
            }
        } else {
            String temp = simpleDateFormat.format(timeNow);
            timeNow = simpleDateFormat.parse(temp);
            if (timeNow.equals(fromTimeTemp)) {
                return true;
            }
        }
        return false;
    }

    public static boolean checkCurrentTimeBetween(String fromTimeS, String toTimeSet, Date timeNow) throws Exception {

        //validate from time and to time
        if (!validateTime(fromTimeS)) {
            return false;
        }
        if (!validateTime(toTimeSet)) {
            return false;
        }

        String today = DateTimeUtils.convertDateToString(timeNow, "yyyyMMdd");
        /*String today = calendar.get(Calendar.YEAR) + ""
         + (calendar.get(Calendar.MONTH) + 1) + ""
         + calendar.get(Calendar.DAY_OF_MONTH);*/
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMddHH:mm");

        Date fromTimeTemp = simpleDateFormat.parse(today + fromTimeS);  //date convert from param table
        Date toTimeTemp = simpleDateFormat.parse(today + toTimeSet);      //date convert from param table

        //check time fromDate and time toDate
        if (fromTimeTemp.before(toTimeTemp)) { // if from time < to time download in a day
            if (timeNow.before(toTimeTemp) && timeNow.after(fromTimeTemp)) {
                return true;
            }
        } else if (fromTimeTemp.after(toTimeTemp)) {

//            if (timeNow.before(new Date(toTimeTemp.getTime()+24*60*60*1000)) && timeNow.after(fromTimeTemp)) {
//                return true;
//            }
            Date toTime1 = simpleDateFormat.parse(today + "24:00");
            Date fromTime1 = simpleDateFormat.parse(today + "00:00");
            if ((timeNow.before(toTime1) && timeNow.after(fromTimeTemp)) || (timeNow.before(toTimeTemp) && timeNow.after(fromTime1))) {
                return true;
            }
        } else {
            String temp = simpleDateFormat.format(timeNow);
            timeNow = simpleDateFormat.parse(temp);
            if (timeNow.equals(fromTimeTemp)) {
                return true;
            }
        }
        return false;
    }

    /**
     * true if current time is between from time and to time other return fail
     *
     * @param date
     * @param fromTime
     * @param toTime
     * @return
     * @throws Exception
     */
    public static boolean checkTimeBetween(Date date, String fromTime, String toTime) throws Exception {

        //validate from time and to time
        if (!validateTime(fromTime)) {
            return false;
        }
        if (!validateTime(toTime)) {
            return false;
        }
        String today = DateTimeUtils.convertDateToString(date, "yyyyMMdd");
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMddHH:mm");

        Date fromTimeDate = simpleDateFormat.parse(today + fromTime);
        Date toTimeDate = simpleDateFormat.parse(today + toTime);

        //check time fromDate and time toDate
        if (date.after(fromTimeDate) && date.before(toTimeDate)) {
            return true;
        }
        return date.compareTo(toTimeDate) == 0 || date.compareTo(fromTimeDate) == 0;
    }

    /**
     * Get String of today is formated YYYYMMDD
     *
     * @param fromTimeSet
     * @param toTimeSet
     * @return today
     * @throws Exception
     */
    public static String getTodayDependParam(String fromTimeSet, String toTimeSet) throws Exception {
        try {
            fromTimeSet = fromTimeSet.trim();
            toTimeSet = toTimeSet.trim();
            Calendar calendar = Calendar.getInstance();
            //validate from time and to time
            if (!DateTimeUtils.validateTime(fromTimeSet)) {
                return "";
            }
            if (!DateTimeUtils.validateTime(toTimeSet)) {
                return "";
            }
            String today = convertDateToString(new Date(), "yyyyMMdd");
            /*String today = calendar.get(Calendar.YEAR) + ""
             + (calendar.get(Calendar.MONTH) + 1) + ""
             + calendar.get(Calendar.DAY_OF_MONTH);*/
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMddHH:mm");

            Date fromTime = simpleDateFormat.parse(today + fromTimeSet);
            Date toTime = simpleDateFormat.parse(today + toTimeSet);
            if (fromTime.after(toTime) && calendar.getTime().before(toTime)) { // da sang ngay tiep theo, giam 1 ngay trong ten file
                calendar.add(Calendar.DAY_OF_MONTH, -1);
                today = convertDateToString(calendar.getTime(), "yyyyMMdd");
            }
            return today;
        } catch (Exception e) {
            throw e;
        }
    }

    /**
     * Get String of file day to get file,format: YYYYMMDD
     *
     * @param exportTime
     * @return today
     * @throws Exception
     */
    public static String getFileTimeLabel(String exportTime) throws Exception {
        try {
            if (!DateTimeUtils.validateTime(exportTime)) {
                return "";
            }
            Calendar calendar = Calendar.getInstance();
            String today = convertDateToString(new Date(), "yyyyMMdd");
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMddHH:mm");
            Date todayExportTime = simpleDateFormat.parse(today + exportTime);
            if (calendar.getTime().before(todayExportTime)) {
                calendar.add(Calendar.DAY_OF_MONTH, -1);
                today = convertDateToString(calendar.getTime(), "yyyyMMdd");
            }
            return today;
        } catch (Exception e) {
            throw e;
        }
    }

    /**
     * get Num Of Day from startDate to endDate
     *
     * @param startDateTime
     * @param endDate
     * @return
     * @throws Exception
     */
    public static Integer getNumOfDay(Date startDateTime, Date endDate) throws Exception {
        try {
            if (startDateTime == null || endDate == null) {
                return null;
            }
            Date startDate = convertStringToDate(convertDateToString(startDateTime, "yyyy-MM-dd"));
            final long DAY_IN_MILLIS = 1000 * 60 * 60 * 24;
            int diffInDays = 0;
            if (startDate != null) {
                diffInDays = (int) ((endDate.getTime() - startDate.getTime()) / DAY_IN_MILLIS);
            }
            return diffInDays;
        } catch (Exception e) {
            logger.error("Have Error", e);
        }
        return null;
    }

    /*
     * checkCurrentDateTimebetween
     * 
     */
    public static boolean checkCurrentDateTimebetween(Date curentDate, Date dateStart, Date dateEnd) {
        if (curentDate != null && dateStart != null && dateEnd != null) {
            return curentDate.after(dateStart) && curentDate.before(dateEnd);
        }
        return false;
    }

    /*
     * addMuniteToDateTime
     * 
     */
    public static Date addMuniteToDateTime(Date pdteDatetime, int plMunite) {
        Date dteDateTimeAfterAdd = pdteDatetime;
        if (pdteDatetime != null) {
            Calendar cal = Calendar.getInstance();
            cal.setTime(pdteDatetime);
            cal.add(Calendar.MINUTE, plMunite);
            dteDateTimeAfterAdd = cal.getTime();
        }
        return dteDateTimeAfterAdd;
    }

    public static int compareDateTime(Date d1, Date d2) {
        int result = 0;
        Calendar cal1 = Calendar.getInstance();
        Calendar cal2 = Calendar.getInstance();
        cal1.setTime(d1);
        cal2.setTime(d2);
        if (cal1.after(cal2)) {
            result = 1;
        } else if (cal1.before(cal2)) {
            result = -1;
        }
        return result;
    }

    public static XMLGregorianCalendar getCurrentXMLGregorianCalendar() throws DatatypeConfigurationException {
        return convertDateToXMLDate(Calendar.getInstance().getTime());
    }

    public static XMLGregorianCalendar convertDateToXMLDate(Date date) throws DatatypeConfigurationException {
        XMLGregorianCalendar xmlDate = DatatypeFactory.newInstance().newXMLGregorianCalendar();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        xmlDate.setDay(calendar.get(Calendar.DATE));
        xmlDate.setMonth(calendar.get(Calendar.MONTH) + 1);
        xmlDate.setYear(calendar.get(Calendar.YEAR));
        return xmlDate;
    }

    public static XMLGregorianCalendar createXMLDate(int day, int month, int year) throws DatatypeConfigurationException {
        XMLGregorianCalendar xmlDate = DatatypeFactory.newInstance().newXMLGregorianCalendar();
        xmlDate.setDay(day);
        xmlDate.setMonth(month);
        xmlDate.setYear(year);
        return xmlDate;
    }

    /**
     * convertDateToYYYYMMDD
     *
     * @return
     * @throws Exception
     */
    public static String convertDateToYYYYMMDD() throws Exception {
        return convertDateToString(new Date(), "yyyyMMdd");
    }

    /**
     * convertDateToYYYYMMDDHHmmss
     *
     * @param date
     * @return
     * @throws Exception
     */
    public static String convertDateToYYYYMMDDHHmmss(Date date) throws Exception {
        return convertDateToString(date, "yyyyMMddHHmmss");
    }

    /**
     * convertDateToYYYYMMDDHHmmss
     *
     * @param date
     * @return
     * @throws Exception
     */
    public static String convertDateToYYYYMM(Date date) throws Exception {
        return convertDateToString(date, "yyyyMM");
    }

    /**
     * convert ve thoi gian dau ngay
     *
     * @param date
     * @return
     */
    public static Date convertToStartDate1(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar.getTime();
    }

    public static Date convertToStartDate(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.MILLISECOND, 0);
        calendar.set(calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH), calendar.get(Calendar.DATE), 0, 0, 0);
        return calendar.getTime();
    }

    /**
     * convertToEndDate
     *
     * @param date
     * @return
     */
    public static Date convertToEndDate(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DATE, 1);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar.getTime();
    }
    
    /// linhpn_esct convert ve thoi gian cuoi ngay
    public static Date convertToEndDate1(Date date) {
         Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);       
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.SECOND, 59);
        calendar.set(Calendar.MILLISECOND, 999);
        return calendar.getTime();
    }

    /**
     * convertDateToStringByFormat
     *
     * @param date
     * @param pattern
     * @return
     */
    public static String convertDateToStringByFormat(Date date, String pattern) {
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat(pattern); //"dd/MM/yyyy HH:mm:ss"
            if (date == null) {
                return null;
            }
            return dateFormat.format(date);
        } catch (Exception ex) {
            logger.error("Have Error", ex);
        }
        return null;
    }
}
