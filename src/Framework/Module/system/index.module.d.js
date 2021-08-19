'use strict';
'use warning';
/**
 * DKA JS FRAMEWORK
 * @author Yovangga Anandhika
 * @email dhikaprivate@gmail.com
 * All Right Reserved.
 * @TODO ---------------------------------------------------------------------------------------
 * @TODO PLEASE DO NOT EDIT OR REMOVE THIS FILE | THIS IS DKA FRAMEWORK MODULE
 * @TODO HARAP UNTUK TIDAK MERUBAH ATAU MENGHAPUS DATA INI | DATA INI ADALAH MODUL DKA FRAMEWORK
 * @TODO PELANGGARAN HAK CIPTA BERLAKU | HARAP MENGHARGAI KARYA ORANG LAIN
 * @TODO ---------------------------------------------------------------------------------------
 * @licence MIT LICENCE
 */

/**
 * @TODO Func Functions
 * @TODO Adalah pustaka Untuk Memuat General Fungsi yang Dibutuhkan dalam Kebutuhan Development Bagi Developer Aplikasi
 * @TODO Module Ini Memuat :
 * @TODO Cookie - Adalah Fungsi Untuk Menjalankan Perintah Cookie Atau Penyimpanan Kue Sementara Di Browser
 * @TODO Session - Adalah Fungsi Untuk Menjalankan Perintah Sesi Dan Mendeteksi Aktivitas Sesi User
 * @TODO FileUploader - Adalah Fungsi Untuk Menjalankan Perintah Untuk Uploader File dan Menjalankan Multipart Upload
 * **/

import Functions from "./Functions";
/**
 * @TODO Server Server
 * @TODO Adalah Pustaka Untuk menjalankan Applikasi Sebagai Web Server Dengan Kecepatan Optimal Pada Project Apps
 * @TODO Module Ini Memuat :
 * @TODO : HTTP - Adalah Sebuah Pustaka Dasar Untuk Menjalankan WebServer Protocol HTTP
 * @TODO : Restify Api - Adalah Sebuah Library Api Untuk Melakukan Fungsional Lite WebServer Dengan Library
 * @TODO : Fastify Api - Adalah Sebuah library API Untuk Melakukan Fungsional Web Server Dengan Eco System
 * **/
import Server from "./Server";
/**
 *
 */
import Security from "./Security";
import Config from "./Config";
import Database from "./Database";
import Router from "./Router";
import Options from "./Options";
import Api from "./Api";

/**
/**
 *
 * @type {{Server: *, Config: *, Database: *, Router: *, Store: *, Functions: *, Security: *}}
 */
const DKA = {
    Functions: Functions,
    Security: Security,
    Config: Config,
    Database: Database,
    Router: Router,
    Server : Server,
    Options : Options,
    Api : Api
};



global.DKA = DKA;
global.DKAnum = 0;
global.DKAServerConfig = [];

export default DKA;
export {Functions, Security, Config, Database, Router, Server, Options, Api};


