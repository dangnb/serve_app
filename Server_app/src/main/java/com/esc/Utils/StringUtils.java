/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.esc.Utils;

import com.esc.restfull.AccountController;
import java.math.BigDecimal;
import java.net.InetAddress;
import java.text.DecimalFormat;
import java.text.Normalizer;
import java.util.Calendar;
import java.util.Random;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.apache.logging.log4j.LogManager;

/**
 *
 * @author nguye
 */
public final class StringUtils {
    public static final org.apache.logging.log4j.Logger logger = LogManager.getLogger(StringUtils.class);
//    private static Pattern pattern;
//    private static Matcher matcher;
    private static final String EMAIL_PATTERN
            = "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])";
//            = "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@"
//            + "[A-Za-z0-9\\-]+(\\.[A-Za-z0-9\\-]+)*(\\.[A-Za-z]{2,})$";//old: "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-\\-]+(\\.[A-Za-z0-9\\-]+)*(\\.[A-Za-z]{2,})$"
    //private static final String EMAIL_PATTERN1 ="^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";

    private static final String NON_SPECIAL_CHARACTER = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-";
    /**
     * alphabeUpCaseNumber.
     */
    private static final String ALPHABET_UPPER_CASE_NUMBER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    /**
     * INVOICE_MAX_LENGTH.
     */
    private static final int INVOICE_MAX_LENGTH = 7;
    /**
     * ZERO.
     */
    private static final String ZERO = "0";

    /**
     * Creates a new instance of StringUtils
     */
    private StringUtils() {
    }

    /**
     * validate IPAdress
     *
     * @param ip
     * @return
     */
    public static boolean validateIPAdress(String ip) {
        String ipAddressPartern = "^([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\."
                + "([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\."
                + "([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\."
                + "([01]?\\d\\d?|2[0-4]\\d|25[0-5])$";
        Pattern pattern = Pattern.compile(ipAddressPartern);
        Matcher matcher = pattern.matcher(ip);
        return matcher.matches();

    }

    /**
     * validate IPAdress
     *
     * @param ip
     * @param allowIP
     * @return
     */
    public static boolean validateIP(String ip, String allowIP) {
        if (allowIP != null) {
            String[] listIP = allowIP.split("\\|");
            Pattern singleIp = Pattern.compile("^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$");
            Pattern rangeDIp = Pattern.compile("^(?:[0-9\\*]{1,3}\\.){3}[0-9\\*]{1,3}$");
            for (String listIP1 : listIP) {
                if (singleIp.matcher(listIP1).matches()) {
                    if (ip.equals(listIP1)) {
                        return true;
                    }
                } else if (rangeDIp.matcher(listIP1).matches() && checkIPRegex(ip, listIP1)) {
                    return true;
                }
            }
        }
        return false;
//        if (!IpUtils.isValidIpRegex(ip)) {
//            return false;
//        }
//        return IpUtils.matchIssueIp(ip, allowIP) == IpUtils.IS_VALID;
    }

    public static boolean checkIPRegex(String ip, String strRegex) {
        String regex = strRegex.replace(".", "\\.").replace("*", ".*");
        Pattern r = Pattern.compile(regex);
        Matcher matcher = r.matcher(ip);
        return matcher.matches();
    }

    /**
     * method compare two string
     *
     * @param str1 String
     * @param str2 String
     * @return boolean
     */
    public static boolean compareString(String str1, String str2) {
        if (str1 == null) {
            str1 = "";
        }
        if (str2 == null) {
            str2 = "";
        }

        return str1.equals(str2);
    }

    /**
     * method convert long to string
     *
     * @param lng Long
     * @return String
     * @throws java.lang.Exception
     */
    public static String convertFromLongToString(Long lng) throws Exception {
        return Long.toString(lng);
    }

    /*
     *  @todo: convert from Long array to String array
     */
    public static String[] convertFromLongToString(Long[] arrLong) throws Exception {
        String[] arrResult = new String[arrLong.length];

        int length = arrLong.length;
        for (int i = 0; i < length; i++) {
            arrResult[i] = convertFromLongToString(arrLong[i]);
        }
        return arrResult;
    }

    /*
     *  @todo: convert from String array to Long array
     */
    public static long[] convertFromStringToLong(String[] arrStr) throws Exception {
        long[] arrResult = new long[arrStr.length];

        int length = arrStr.length;
        for (int i = 0; i < length; i++) {
            arrResult[i] = Long.parseLong(arrStr[i]);
        }
        return arrResult;

    }

    /*
     *  @todo: convert from String value to Long value
     */
    public static long convertFromStringToLong(String value) throws Exception {
        return Long.parseLong(value);
    }


    /*
     * Check String that containt only AlphabeUpCase and Number
     * Return True if String was valid, false if String was not valid
     */
    public static boolean checkAlphabeUpCaseNumber(String value) {
        boolean result = true;
        int length = value.length();
        for (int i = 0; i < length; i++) {
            String temp = value.substring(i, i + 1);
            if (!ALPHABET_UPPER_CASE_NUMBER.contains(temp)) {
                result = false;
                return result;
            }
        }
        return result;
    }

    public static String standardInvoiceString(Long input) {
        String temp;
        if (input == null) {
            return "";
        }
        temp = input.toString();
        if (temp.length() <= INVOICE_MAX_LENGTH) {
            int count = INVOICE_MAX_LENGTH - temp.length();
            for (int i = 0; i < count; i++) {
                temp = ZERO + temp;
            }
        }
        return temp;
    }

    public static boolean validString(String temp) {
        return !(temp == null || ("").equalsIgnoreCase(temp.trim()));
    }

//    public static Boolean isNullOrEmpty(String str) {
//        return (str == null || "".equals(str));
//    }
    public static String convertEmptyString(String strSource) {
        String str = "";
        if (strSource == null || ("").equalsIgnoreCase(strSource.trim())) {
            return "";
        }
        if (strSource.length() > 0) {
            Integer length = strSource.length();
            for (int i = 0; i < length; i++) {
                if (strSource.charAt(i) == ' ') {
                    str += "-";
                } else {
                    str += strSource.substring(i, length);
                    break;
                }
            }
        }
        return str;
    }

    public static String getSafeFileName(String input) {
        StringBuilder sb = new StringBuilder();
        int length = input.length();
        for (int i = 0; i < length; i++) {
            char c = input.charAt(i);
            if (c != '/' && c != '\\' && c != 0) {
                sb.append(c);
            }
        }
        return sb.toString();
    }

    /**
     * getSafeFieldName
     *
     * @param fieldName
     * @return
     */
    public static String getSafeFieldName(String fieldName) {
        if (fieldName == null || ("").equalsIgnoreCase(fieldName.trim())) {
            return null;
        }
        /*List lstErrorChar = new ArrayList();

         lstErrorChar.add(" ");
         lstErrorChar.add(",");
         lstErrorChar.add("/");
         lstErrorChar.add("(");
         lstErrorChar.add(")");
         lstErrorChar.add("'");
         lstErrorChar.add("=");
         lstErrorChar.add("<");
         lstErrorChar.add(">");
         lstErrorChar.add("!");
         fieldName = StringEscapeUtils.escapeSql(fieldName);*/
        if (!fieldName.matches("[a-zA-Z_]+$")) {
            return null;
        }
        /*for (int i = 0; i < fieldName.length(); i++) {
         char c = fieldName.charAt(i);
         if (lstErrorChar.contains(String.valueOf(c))) {
         return null;
         }
         }*/
        return fieldName;
    }

    public static Boolean checkInvoiceTemplateCode(String fieldName) {
        if (fieldName == null || ("").equalsIgnoreCase(fieldName.trim())) {
            return false;
        }
        return fieldName.matches("^[A-Z0-9\\/]+$");
    }

    public static Boolean checkInvoiceSerialNo(String fieldName) {
        if (isNullOrEmpty(fieldName)) {
            return false;
        }
        return fieldName.matches("^[a-zA-Z]{2}\\/[0-9]{2}[E,e]{1}$");
    }

    public static Boolean checkFieldName(String fieldName) {
        if (isNullOrEmpty(fieldName)) {
            return false;
        }
        return fieldName.matches("[a-zA-Z_]+$");
    }

    public static Boolean checkAlphaNumeric(String str) {
        if (isNullOrEmpty(str)) {
            return false;
        }
        return true;
//        return str.matches("[a-zA-Z0-9]+$");
    }

    public static boolean isAlpha(String name) {
        char[] chars = name.toCharArray();

        for (char c : chars) {
            if (!Character.isLetter(c)) {
                return false;
            }
        }

        return true;
    }

    public static boolean isNumeric(String str) {
        if (isNullOrEmpty(str)) {
            return false;
        }
        return str.matches("[0-9]+$");
    }

    public static boolean checkProductCode(String str) {
        if (StringUtils.isNullOrEmpty(str)) {
            return false;
        }
        String pattern = "^[a-zA-Z0-9\\/. _-]+$";
        return str.matches(pattern);
    }

    public static boolean checkBankAccount(String str) {
        if (StringUtils.isNullOrEmpty(str)) {
            return false;
        }
        String pattern = "^[0-9a-zA-Z -]+$";
        return str.matches(pattern);
    }

    public static boolean checkWebsite(String str) {
        if (isNullOrEmpty(str)) {
            return false;
        }
        String pattern = "^(https?:\\/\\/)?([\\w\\d\\-_]{2,}\\.+[A-Za-z\\-_]{2,})+\\/?(.)*";

        return str.matches(pattern);
    }

    public static boolean checkEmail(String str) {
        if (isNullOrEmpty(str)) {
            return false;
        }
        return str.toLowerCase().matches(EMAIL_PATTERN);
    }

    public static boolean checkPhoneFaxNumber(String str) {
        if (isNullOrEmpty(str)) {
            return false;
        }
        String pattern = "^[0-9]+$";
        return str.matches(pattern);
    }

    public static boolean checkAddress(String str) {
        if (isNullOrEmpty(str)) {
            return false;
        }
        return true;
//        String pattern = "^[0-9a-zA-Z-_/ ]+$";
//        String pattern = MemoryDataLoader.getParamName("REGEX_VALIDATE_DATA", "ADDRESS");
//        return renameVietnameseToEnglish(str).matches(pattern);
    }

    public static boolean checkDistrictName(String str) {
        if (isNullOrEmpty(str)) {
            return false;
        }
        return true;
//        String pattern = "^[0-9a-zA-Z ]+$";
//        return str.matches(pattern);
    }

    public static boolean checkCityName(String str) {
        if (isNullOrEmpty(str)) {
            return false;
        }
        return true;
//        String pattern = "^[a-zA-Z ]+$";
//        return str.matches(pattern);
    }

    public static boolean checkPerSonName(String str) {
        if (isNullOrEmpty(str)) {
            return false;
        }
        return true;
//        String pattern = "^[a-zA-Z _-]+$";
//        return str.matches(pattern);

    }

    public static boolean checkBankName(String str) {
        if (isNullOrEmpty(str)) {
            return false;
        }
        return true;
//        String pattern = "^[a-zA-Z0-9 _-]+$";
//        return str.matches(pattern);

    }

    public static boolean checkBussinessLicenceNo(String str) {
        if (isNullOrEmpty(str)) {
            return false;
        }
        return true;
//        String pattern = "^[0-9A-Za-zĐ\\/-]+$";
//
//        return str.matches(pattern);

    }

    /**
     * <p>
     * Author: dungnv93 </p>
     * <p>
     * Create date : 17/07/2017
     * <p>
     * @param str
     * @return
     */
//    public static boolean checkTaxCode(String str) {
//        if (isNullOrEmpty(str)) {
//            return false;
//        }
//
//        String pattern = "^[0-9]+$";
//        int pos = str.indexOf("-");
//        if (pos != -1) {
//            String prefix = str.substring(0, pos);
//            String suffix = str.substring(pos + 1);
//            return prefix.matches(pattern) && suffix.matches(pattern);
//        }
//
//        return str.matches(pattern);
//    }
    /**
     * <p>
     * Last update user: huypq15 </p>
     * <p>
     * Last up date : 20/08/2017
     *
     * <p>
     * @param str
     * @return
     */
    public static boolean checkTaxCode(String str) {
        if (isNullOrEmpty(str)) {
            return false;
        }

        str = str.trim();
        int length = str.length();

        if (length != 10 && length != 14) {
            return false;
        }
        String pattern = "^[0-9]+$";

        if (length == 10) {
            if (!str.matches(pattern)) {
                return false;
            }

        }

        if (length == 14) {
            String[] arr = str.split("-");
            if (arr.length != 2) {
                return false;
            }
            if (!arr[0].matches(pattern) || !arr[1].matches(pattern)) {
                return false;
            }
        }

        int A1 = Integer.parseInt(str.substring(0, 1)) * 31;
        int A2 = Integer.parseInt(str.substring(1, 2)) * 29;
        int A3 = Integer.parseInt(str.substring(2, 3)) * 23;
        int A4 = Integer.parseInt(str.substring(3, 4)) * 19;
        int A5 = Integer.parseInt(str.substring(4, 5)) * 17;
        int A6 = Integer.parseInt(str.substring(5, 6)) * 13;
        int A7 = Integer.parseInt(str.substring(6, 7)) * 7;
        int A8 = Integer.parseInt(str.substring(7, 8)) * 5;
        int A9 = Integer.parseInt(str.substring(8, 9)) * 3;
        int A = A1 + A2 + A3 + A4 + A5 + A6 + A7 + A8 + A9;
        int B = A % 11;
        int C = 10 - B;
        if (C != Integer.parseInt(str.substring(9, 10))) {
            return false;
        }

        return true;
    }

    /**
     * huypq15
     *
     * @param str
     * @return
     */
    public static boolean checkValidName(String str) {
        if (isNullOrEmpty(str)) {
            return false;
        }
        return true;
//        String pattern = "^[a-zA-Z0-9 _-]+$"; // dont let space right behind -
//        String pattern = MemoryDataLoader.getParamName("REGEX_VALIDATE_DATA", "NAME");
//        return renameVietnameseToEnglish(str).matches(pattern);
    }

    public static Boolean checkNotAlphaNumeric(String str) {
        if (isNullOrEmpty(str)) {
            return false;
        }
        return str.matches("^[a-zA-Z0-9]+$");
    }

    public static Boolean checkNumeric(String str) {
        if (isNullOrEmpty(str)) {
            return false;
        }
        return str.matches("[0-9]+$");
    }

    public static String getLimitedString(String str, Integer maxlength) {
        if (!isNullOrEmpty(str)) {
            if (str.length() <= maxlength) {
                return str;
            } else {
                return str.substring(0, maxlength);
            }
        }
        return "";
    }

    /**
     * <p>
     * Last update user: dungnv93
     * </p>
     * <p>
     * Last update Time : 07/09/2017
     * </p>
     * check null or empty
     *
     * @param object
     * @return
     */
    public static Boolean isNullOrEmpty(Object object) {
        if (object == null || object.toString().trim().isEmpty()) {
            return true;
        }
        return false;
    }

    public static String renameVietnameseToEnglish(String input) {
        if (isNullOrEmpty(input)) {
            return input;
        }
        String nfdNormalizedString = Normalizer.normalize(input.toLowerCase(), Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(nfdNormalizedString).replaceAll("").replace('đ', 'd').replaceAll(" +", " ");
    }

//    public static String encryptPassword(String password) {
//        MessageDigest md = null;
//        try {
//            md = MessageDigest.getInstance("SHA-1");
//        } catch (Exception e) {
//            logger.error("Have error", e);
//        }
//        if (md == null) {
//            return null;
//        }
//        try {
//            md.update(password.getBytes("UTF-8"));
//        } catch (Exception e) {
//            logger.error("Have error", e);
//        }
//        byte raw[] = md.digest();
//        //String hash = (new BASE64Encoder()).encode(raw);
//        String hash = new String(Base64.encodeBase64(raw));
//        return hash;
//    }
    public static String format(BigDecimal dblNumber, String strPattern) {
        DecimalFormat fmt = new DecimalFormat(strPattern);
        return fmt.format(dblNumber);
    }

    public static String getNonSpecialCharacterString(String str) {
        String returnStr = "";
        if (str != null) {
            String str1 = str.trim();
            int length = str1.length();
            for (int i = 0; i < length; i++) {
                if (NON_SPECIAL_CHARACTER.indexOf(str1.charAt(i)) > -1) {
                    returnStr += str.charAt(i);
                } else {
                    returnStr += "_";
                }
            }
        }
        return returnStr;
    }

    public static boolean checkCountryCode(String str) {
        if (isNullOrEmpty(str)) {
            return false;
        }

        String pattern = "^[0-9-]+$";
        return str.matches(pattern);
    }


    /*static public boolean validateIP(String ip, String allowIP) {
     String[] listIP = allowIP.split("\\|");
     Pattern singleIp = Pattern.compile("^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$");
     Pattern rangeDIp = Pattern.compile("^(?:[0-9]{1,3}\\.){3}\\*$");
     for (int i = 0; i < listIP.length; i++) {
     if (singleIp.matcher(listIP[i]).matches()) {
     if (ip.equals(listIP[i])) {
     return true;
     }
     } else if (rangeDIp.matcher(listIP[i]).matches()) {
     if (ip.substring(0, ip.lastIndexOf(".")).equals(
     listIP[i].substring(0, listIP[i].lastIndexOf(".")))) {
     return true;
     }
     }
     }
     return false;
     }*/
    public static String getIPAddress() throws Exception {
        InetAddress ip = InetAddress.getLocalHost();
        return ip.getHostAddress();
    }


    public static String removePSM(String soapMsg) {
        int firstPos;
        int lastPos;

        if (soapMsg.contains("<password>")) {
            firstPos = soapMsg.indexOf("<password>") + "<password>".length();
            lastPos = soapMsg.indexOf("</password>", firstPos);

            soapMsg = soapMsg.substring(0, firstPos) + "****************" + soapMsg.substring(lastPos);
        } else if (soapMsg.contains("<password xmlns:ns2=\"http://ws.einvoicegw.viettel.com/\">")) {
            firstPos = soapMsg.indexOf("<password xmlns:ns2=\"http://ws.einvoicegw.viettel.com/\">") + "<password xmlns:ns2=\"http://ws.einvoicegw.viettel.com/\">".length();
            lastPos = soapMsg.indexOf("</password>", firstPos);

            soapMsg = soapMsg.substring(0, firstPos) + "****************" + soapMsg.substring(lastPos);
        }
        return soapMsg;
    }

    public static boolean checkPaymentMethod(String str) {
        if (isNullOrEmpty(str)) {
            return false;
        }

        return str.matches("^(01|02)$");
    }

    /**
     * Generate a random string
     *
     * @param length The length of the random string
     * @return A random string
     */
    public static String createRandomString(int length) {
        if (length <= 0) {
            return "";
        }
        String pattern = "abcdefghijklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ0123456789";
        int count = 0;
        int parrterLen = pattern.length();
        StringBuilder builder = new StringBuilder();
        Random rand = new Random();
        while (count < length) {
            builder.append((pattern.charAt(rand.nextInt(parrterLen))));
            count++;
        }
        return builder.toString();

    }

    /**
     * <p>
     * Author: dungnv93 </p>
     * <p>
     * Standardize address string </p>
     *
     * @param address
     * @return
     */
    public static String standardizeAdress(String address) {
        if (isNullOrEmpty(address)) {
            return "";
        }

        String[] addressArray = address.split(" ");
        int len = addressArray.length;
        for (int i = 0; i < len; i++) {
            String ele = addressArray[i];
            if (!isNullOrEmpty(ele)) {
                ele = ele.substring(0, 1).toUpperCase() + ele.substring(1);
                addressArray[i] = ele;
            }
        }
        String result = "";
        for (int i = 0; i < len; i++) {
            result += " " + addressArray[i];
        }
        result = result.substring(1);
        return result;
    }

    /**
     * <p>
     * Check id number </p>
     * <p>
     * Include identity card number, passport number, motobike driving
     * liscence</p>
     * <p>
     * Author: dungnv93, Created date 27/07/2017 </p>
     *
     * @param str
     * @return
     */
    public static boolean checkIdNumber(String str) {
        if (isNullOrEmpty(str)) {
            return false;
        }
        String patter = "^[ĐA-Za-z/0-9–-]+$";
        return str.matches(patter);

    }

    /**
     * <p>
     * Last update dev: dungnv93
     * </p>
     * <p>
     * Last update time: 19/09/2017
     * </p>
     *
     * @param productName
     * @return
     */
    public static boolean checkProductNameAllowVietnamese(String productName) {
        try {
            if (isNullOrEmpty(productName)) {
                return false;
            }

            //        String pattern = "^[^\!-\'\*-\,\.\/\:-\@\[-\^\`\{-\~]+$";
            //        String pattern = "^[a-zA-Z0-9 ()_-]+$";
//            ParamBO tmpParamBO = MemoryDataLoader.getParamBO("REGEX_VALIDATE_DATA", "PRODUCT_NAME");
//            logger.info("product name regex: " + tmpParamBO.getName());
//            String productNameAscii = renameVietnameseToEnglish(productName);
//            return productNameAscii.matches(tmpParamBO.getName());
            return true;
        } catch (Exception ex) {
            logger.error("Have error checkProductNameAllowVietnamese ", ex);
        }
        return false;
    }

    /**
     * Check if name is alpha,number, -, _ or space. Especially name can be
     * Vietnamese name
     *
     * @param name
     * @return
     */
    public static boolean checkNameAllowVietnamese(String name) {
        if (isNullOrEmpty(name)) {
            return false;
        }
//        String pattern = "^[^\\!-\\,\\.\\/\\:-\\@\\[-\\^\\`\\{-\\~]+$";
        return true;
//        String pattern = "^[a-zA-Z0-9 _–-]+$";
//        String vnName = renameVietnameseToEnglish(name);
//        return vnName.matches(pattern);
    }

    public static boolean checkUnitNameAllowVietnamese(String username) {
        return checkNameAllowVietnamese(username);
    }

    public static String autoGenProductCode(String name) {
        if (StringUtils.isNullOrEmpty(name)) {
            return name;
        }
        String autoGenCode = StringUtils.renameVietnameseToEnglish(name).replace(" ", "_").replaceAll("[^a-zA-Z0-9_.–-]", "");
        if (autoGenCode.length() > 50) { //50 - maxLength of productCode
            autoGenCode = autoGenCode.substring(0, 50);
        }
        return autoGenCode;
    }
}
