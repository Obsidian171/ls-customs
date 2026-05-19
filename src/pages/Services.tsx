import { useState } from 'react'

// Импортируем базовые изображения
import imbolazerImg from '../../img/imbolazer.jpg'
import gsmImg from '../../img/gsm.jpg'
import motorImg from '../../img/motor.png'
import fuelImg from '../../img/fuel.png'
import electroImg from '../../img/electro.png'
import pokrskaImg from '../../img/pokrska.jpeg'
import alienImg from '../../img/alien.jpg'
import xflowImg from '../../img/x-flow.jpg'
import chromeImg from '../../img/chrome.jpg'
import slaminImg from '../../img/slamin.jpg'
import reshetkaChromeImg from '../../img/reshetka_chrome.jpg'
import reshetkaSlaminImg from '../../img/reshetka_slamin.jpg.jpg'

// Импортируем колеса
import offroadImg from '../../img/whels/offroad.png'
import shadowImg from '../../img/whels/shadow.png'
import megaImg from '../../img/whels/mega.png'
import rimshineImg from '../../img/whels/rimshine.png'
import wiresImg from '../../img/whels/wires.png'
import classicImg from '../../img/whels/classic.png'
import twistImg from '../../img/whels/twist.png'
import cuterImg from '../../img/whels/cuter.png'
import switchImg from '../../img/whels/switch.png'
import grooveImg from '../../img/whels/groove.png'
import importImg from '../../img/whels/import.png'
import dolarImg from '../../img/whels/dolar.png'
import tranceImg from '../../img/whels/trance.png'
import atomicImg from '../../img/whels/atomic.png'
import ahabImg from '../../img/whels/ahab.png'
import virtualImg from '../../img/whels/virtual.png'
import accesImg from '../../img/whels/acces.png'

// Импортируем Спойлеры
import spoilerAlienImg from '../../img/spoiler/alien.jpg'
import spoilerXflowImg from '../../img/spoiler/x-flow.jpg'

// Импортируем Крыши
import krishaAlienImg from '../../img/krisha/alien.jpg'
import krishaXflowImg from '../../img/krisha/x-flow.jpg'

// Импортируем Выхлоп
import vihlopAlienImg from '../../img/vihlop/alien.jpg'
import vihlopXflowImg from '../../img/vihlop/x-flow.jpg'

export interface ServiceItem {
  id: number
  name: string
  price: number
  image?: string
  description?: string
  badge?: string
}

export interface ColorItem {
  id: number
  name: string
  hex: string
  price: number
}

export const gtasaColors: ColorItem[] = [
  { id: 1, name: 'ID 1', hex: '0x000000ff', price: 6000 },
  { id: 2, name: 'ID 2', hex: '0xf5f5f5ff', price: 6000 },
  { id: 3, name: 'ID 3', hex: '0x2a77a1ff', price: 6000 },
  { id: 4, name: 'ID 4', hex: '0x840410ff', price: 6000 },
  { id: 5, name: 'ID 5', hex: '0x263739ff', price: 6000 },
  { id: 6, name: 'ID 6', hex: '0x86446eff', price: 6000 },
  { id: 7, name: 'ID 7', hex: '0xd78e10ff', price: 6000 },
  { id: 8, name: 'ID 8', hex: '0x4c75b7ff', price: 6000 },
  { id: 9, name: 'ID 9', hex: '0xbdbec6ff', price: 6000 },
  { id: 10, name: 'ID 10', hex: '0x5e7072ff', price: 6000 },
  { id: 11, name: 'ID 11', hex: '0x46597aff', price: 6000 },
  { id: 12, name: 'ID 12', hex: '0x656a79ff', price: 6000 },
  { id: 13, name: 'ID 13', hex: '0x5d7e8dff', price: 6000 },
  { id: 14, name: 'ID 14', hex: '0x58595aff', price: 6000 },
  { id: 15, name: 'ID 15', hex: '0xd6dad6ff', price: 6000 },
  { id: 16, name: 'ID 16', hex: '0x9ca1a3ff', price: 6000 },
  { id: 17, name: 'ID 17', hex: '0x335f3fff', price: 6000 },
  { id: 18, name: 'ID 18', hex: '0x730e1aff', price: 6000 },
  { id: 19, name: 'ID 19', hex: '0x7b0a2aff', price: 6000 },
  { id: 20, name: 'ID 20', hex: '0x9f9d94ff', price: 6000 },
  { id: 21, name: 'ID 21', hex: '0x3b4e78ff', price: 6000 },
  { id: 22, name: 'ID 22', hex: '0x732e3eff', price: 6000 },
  { id: 23, name: 'ID 23', hex: '0x691e3bff', price: 6000 },
  { id: 24, name: 'ID 24', hex: '0x96918cff', price: 6000 },
  { id: 25, name: 'ID 25', hex: '0x515459ff', price: 6000 },
  { id: 26, name: 'ID 26', hex: '0x3f3e45ff', price: 6000 },
  { id: 27, name: 'ID 27', hex: '0xa5a9a7ff', price: 6000 },
  { id: 28, name: 'ID 28', hex: '0x635c5aff', price: 6000 },
  { id: 29, name: 'ID 29', hex: '0x3d4a68ff', price: 6000 },
  { id: 30, name: 'ID 30', hex: '0x979592ff', price: 6000 },
  { id: 31, name: 'ID 31', hex: '0x421f21ff', price: 6000 },
  { id: 32, name: 'ID 32', hex: '0x5f272bff', price: 6000 },
  { id: 33, name: 'ID 33', hex: '0x8494abff', price: 6000 },
  { id: 34, name: 'ID 34', hex: '0x767b7cff', price: 6000 },
  { id: 35, name: 'ID 35', hex: '0x646464ff', price: 6000 },
  { id: 36, name: 'ID 36', hex: '0x5a5752ff', price: 6000 },
  { id: 37, name: 'ID 37', hex: '0x252527ff', price: 6000 },
  { id: 38, name: 'ID 38', hex: '0x2d3a35ff', price: 6000 },
  { id: 39, name: 'ID 39', hex: '0x93a396ff', price: 6000 },
  { id: 40, name: 'ID 40', hex: '0x6d7a88ff', price: 6000 },
  { id: 41, name: 'ID 41', hex: '0x221918ff', price: 6000 },
  { id: 42, name: 'ID 42', hex: '0x6f675fff', price: 6000 },
  { id: 43, name: 'ID 43', hex: '0x7c1c2aff', price: 6000 },
  { id: 44, name: 'ID 44', hex: '0x5f0a15ff', price: 6000 },
  { id: 45, name: 'ID 45', hex: '0x193826ff', price: 6000 },
  { id: 46, name: 'ID 46', hex: '0x5d1b20ff', price: 6000 },
  { id: 47, name: 'ID 47', hex: '0x9d9872ff', price: 6000 },
  { id: 48, name: 'ID 48', hex: '0x7a7560ff', price: 6000 },
  { id: 49, name: 'ID 49', hex: '0x989586ff', price: 6000 },
  { id: 50, name: 'ID 50', hex: '0xadb0b0ff', price: 6000 },
  { id: 51, name: 'ID 51', hex: '0x848988ff', price: 6000 },
  { id: 52, name: 'ID 52', hex: '0x304f45ff', price: 6000 },
  { id: 53, name: 'ID 53', hex: '0x4d6268ff', price: 6000 },
  { id: 54, name: 'ID 54', hex: '0x162248ff', price: 6000 },
  { id: 55, name: 'ID 55', hex: '0x272f4bff', price: 6000 },
  { id: 56, name: 'ID 56', hex: '0x7d6256ff', price: 6000 },
  { id: 57, name: 'ID 57', hex: '0x9ea4abff', price: 6000 },
  { id: 58, name: 'ID 58', hex: '0x9c8d71ff', price: 6000 },
  { id: 59, name: 'ID 59', hex: '0x6d1822ff', price: 6000 },
  { id: 60, name: 'ID 60', hex: '0x4e6881ff', price: 6000 },
  { id: 61, name: 'ID 61', hex: '0x9c9c98ff', price: 6000 },
  { id: 62, name: 'ID 62', hex: '0x917347ff', price: 6000 },
  { id: 63, name: 'ID 63', hex: '0x661c26ff', price: 6000 },
  { id: 64, name: 'ID 64', hex: '0x949d9fff', price: 6000 },
  { id: 65, name: 'ID 65', hex: '0xa4a7a5ff', price: 6000 },
  { id: 66, name: 'ID 66', hex: '0x8e8c46ff', price: 6000 },
  { id: 67, name: 'ID 67', hex: '0x341a1eff', price: 6000 },
  { id: 68, name: 'ID 68', hex: '0x6a7a8cff', price: 6000 },
  { id: 69, name: 'ID 69', hex: '0xaaad8eff', price: 6000 },
  { id: 70, name: 'ID 70', hex: '0xab988fff', price: 6000 },
  { id: 71, name: 'ID 71', hex: '0x851f2eff', price: 6000 },
  { id: 72, name: 'ID 72', hex: '0x6f8297ff', price: 6000 },
  { id: 73, name: 'ID 73', hex: '0x585853ff', price: 6000 },
  { id: 74, name: 'ID 74', hex: '0x9aa790ff', price: 6000 },
  { id: 75, name: 'ID 75', hex: '0x601a23ff', price: 6000 },
  { id: 76, name: 'ID 76', hex: '0x20202cff', price: 6000 },
  { id: 77, name: 'ID 77', hex: '0xa4a096ff', price: 6000 },
  { id: 78, name: 'ID 78', hex: '0xaa9d84ff', price: 6000 },
  { id: 79, name: 'ID 79', hex: '0x78222bff', price: 6000 },
  { id: 80, name: 'ID 80', hex: '0x0e316dff', price: 6000 },
  { id: 81, name: 'ID 81', hex: '0x722a3fff', price: 6000 },
  { id: 82, name: 'ID 82', hex: '0x7b715eff', price: 6000 },
  { id: 83, name: 'ID 83', hex: '0x741d28ff', price: 6000 },
  { id: 84, name: 'ID 84', hex: '0x1e2e32ff', price: 6000 },
  { id: 85, name: 'ID 85', hex: '0x4d322fff', price: 6000 },
  { id: 86, name: 'ID 86', hex: '0x7c1b44ff', price: 6000 },
  { id: 87, name: 'ID 87', hex: '0x2e5b20ff', price: 6000 },
  { id: 88, name: 'ID 88', hex: '0x395a83ff', price: 6000 },
  { id: 89, name: 'ID 89', hex: '0x6d2837ff', price: 6000 },
  { id: 90, name: 'ID 90', hex: '0xa7a28fff', price: 6000 },
  { id: 91, name: 'ID 91', hex: '0xafb1b1ff', price: 6000 },
  { id: 92, name: 'ID 92', hex: '0x364155ff', price: 6000 },
  { id: 93, name: 'ID 93', hex: '0x6d6c6eff', price: 6000 },
  { id: 94, name: 'ID 94', hex: '0x0f6a89ff', price: 6000 },
  { id: 95, name: 'ID 95', hex: '0x204b6bff', price: 6000 },
  { id: 96, name: 'ID 96', hex: '0x2b3e57ff', price: 6000 },
  { id: 97, name: 'ID 97', hex: '0x9b9f9dff', price: 6000 },
  { id: 98, name: 'ID 98', hex: '0x6c8495ff', price: 6000 },
  { id: 99, name: 'ID 99', hex: '0x4d8495ff', price: 6000 },
  { id: 100, name: 'ID 100', hex: '0xae9b7fff', price: 6000 },
  { id: 101, name: 'ID 101', hex: '0x406c8fff', price: 6000 },
  { id: 102, name: 'ID 102', hex: '0x1f253bff', price: 6000 },
  { id: 103, name: 'ID 103', hex: '0xab9276ff', price: 6000 },
  { id: 104, name: 'ID 104', hex: '0x134573ff', price: 6000 },
  { id: 105, name: 'ID 105', hex: '0x96816cff', price: 6000 },
  { id: 106, name: 'ID 106', hex: '0x64686aff', price: 6000 },
  { id: 107, name: 'ID 107', hex: '0x105082ff', price: 6000 },
  { id: 108, name: 'ID 108', hex: '0xa19983ff', price: 6000 },
  { id: 109, name: 'ID 109', hex: '0x385694ff', price: 6000 },
  { id: 110, name: 'ID 110', hex: '0x525661ff', price: 6000 },
  { id: 111, name: 'ID 111', hex: '0x7f6956ff', price: 6000 },
  { id: 112, name: 'ID 112', hex: '0x8c929aff', price: 6000 },
  { id: 113, name: 'ID 113', hex: '0x596e87ff', price: 6000 },
  { id: 114, name: 'ID 114', hex: '0x473532ff', price: 6000 },
  { id: 115, name: 'ID 115', hex: '0x44624fff', price: 6000 },
  { id: 116, name: 'ID 116', hex: '0x730a27ff', price: 6000 },
  { id: 117, name: 'ID 117', hex: '0x223457ff', price: 6000 },
  { id: 118, name: 'ID 118', hex: '0x640d1bff', price: 6000 },
  { id: 119, name: 'ID 119', hex: '0xa3adc6ff', price: 6000 },
  { id: 120, name: 'ID 120', hex: '0x695853ff', price: 6000 },
  { id: 121, name: 'ID 121', hex: '0x9b8b80ff', price: 6000 },
  { id: 122, name: 'ID 122', hex: '0x620b1cff', price: 6000 },
  { id: 123, name: 'ID 123', hex: '0x5b5d5eff', price: 6000 },
  { id: 124, name: 'ID 124', hex: '0x624428ff', price: 6000 },
  { id: 125, name: 'ID 125', hex: '0x731827ff', price: 6000 },
  { id: 126, name: 'ID 126', hex: '0x1b376dff', price: 6000 },
  { id: 127, name: 'ID 127', hex: '0xec6aaeff', price: 6000 },
  { id: 128, name: 'ID 128', hex: '0x000000ff', price: 6000 },
  { id: 129, name: 'ID 129', hex: '0x177517ff', price: 6000 },
  { id: 130, name: 'ID 130', hex: '0x210606ff', price: 6000 },
  { id: 131, name: 'ID 131', hex: '0x125478ff', price: 6000 },
  { id: 132, name: 'ID 132', hex: '0x452a0dff', price: 6000 },
  { id: 133, name: 'ID 133', hex: '0x571e1eff', price: 6000 },
  { id: 134, name: 'ID 134', hex: '0x010701ff', price: 6000 },
  { id: 135, name: 'ID 135', hex: '0x25225aff', price: 6000 },
  { id: 136, name: 'ID 136', hex: '0x2c89aaff', price: 6000 },
  { id: 137, name: 'ID 137', hex: '0x8a4dbdff', price: 6000 },
  { id: 138, name: 'ID 138', hex: '0x35963aff', price: 6000 },
  { id: 139, name: 'ID 139', hex: '0xb7b7b7ff', price: 6000 },
  { id: 140, name: 'ID 140', hex: '0x464c8dff', price: 6000 },
  { id: 141, name: 'ID 141', hex: '0x84888cff', price: 6000 },
  { id: 142, name: 'ID 142', hex: '0x817867ff', price: 6000 },
  { id: 143, name: 'ID 143', hex: '0x817a26ff', price: 6000 },
  { id: 144, name: 'ID 144', hex: '0x6a506fff', price: 6000 },
  { id: 145, name: 'ID 145', hex: '0x583e6fff', price: 6000 },
  { id: 146, name: 'ID 146', hex: '0x8cb972ff', price: 6000 },
  { id: 147, name: 'ID 147', hex: '0x824f78ff', price: 6000 },
  { id: 148, name: 'ID 148', hex: '0x6d276aff', price: 6000 },
  { id: 149, name: 'ID 149', hex: '0x1e1d13ff', price: 6000 },
  { id: 150, name: 'ID 150', hex: '0x1e1306ff', price: 6000 },
  { id: 151, name: 'ID 151', hex: '0x1f2518ff', price: 6000 },
  { id: 152, name: 'ID 152', hex: '0x2c4531ff', price: 6000 },
  { id: 153, name: 'ID 153', hex: '0x1e4c99ff', price: 6000 },
  { id: 154, name: 'ID 154', hex: '0x2e5f43ff', price: 6000 },
  { id: 155, name: 'ID 155', hex: '0x1e9948ff', price: 6000 },
  { id: 156, name: 'ID 156', hex: '0x1e9999ff', price: 6000 },
  { id: 157, name: 'ID 157', hex: '0x999976ff', price: 6000 },
  { id: 158, name: 'ID 158', hex: '0x7c8499ff', price: 6000 },
  { id: 159, name: 'ID 159', hex: '0x992e1eff', price: 6000 },
  { id: 160, name: 'ID 160', hex: '0x2c1e08ff', price: 6000 },
  { id: 161, name: 'ID 161', hex: '0x142407ff', price: 6000 },
  { id: 162, name: 'ID 162', hex: '0x993e4dff', price: 6000 },
  { id: 163, name: 'ID 163', hex: '0x1e4c99ff', price: 6000 },
  { id: 164, name: 'ID 164', hex: '0x198181ff', price: 6000 },
  { id: 165, name: 'ID 165', hex: '0x1a292aff', price: 6000 },
  { id: 166, name: 'ID 166', hex: '0x16616fff', price: 6000 },
  { id: 167, name: 'ID 167', hex: '0x1b6687ff', price: 6000 },
  { id: 168, name: 'ID 168', hex: '0x6c3f99ff', price: 6000 },
  { id: 169, name: 'ID 169', hex: '0x481a0eff', price: 6000 },
  { id: 170, name: 'ID 170', hex: '0x7a7399ff', price: 6000 },
  { id: 171, name: 'ID 171', hex: '0x746d99ff', price: 6000 },
  { id: 172, name: 'ID 172', hex: '0x53387eff', price: 6000 },
  { id: 173, name: 'ID 173', hex: '0x222407ff', price: 6000 },
  { id: 174, name: 'ID 174', hex: '0x3e190cff', price: 6000 },
  { id: 175, name: 'ID 175', hex: '0x46210eff', price: 6000 },
  { id: 176, name: 'ID 176', hex: '0x991e1eff', price: 6000 },
  { id: 177, name: 'ID 177', hex: '0x8d4c8dff', price: 6000 },
  { id: 178, name: 'ID 178', hex: '0x805b80ff', price: 6000 },
  { id: 179, name: 'ID 179', hex: '0x7b3e7eff', price: 6000 },
  { id: 180, name: 'ID 180', hex: '0x3c1737ff', price: 6000 },
  { id: 181, name: 'ID 181', hex: '0x733517ff', price: 6000 },
  { id: 182, name: 'ID 182', hex: '0x781818ff', price: 6000 },
  { id: 183, name: 'ID 183', hex: '0x83341aff', price: 6000 },
  { id: 184, name: 'ID 184', hex: '0x8e2f1cff', price: 6000 },
  { id: 185, name: 'ID 185', hex: '0x7e3e53ff', price: 6000 },
  { id: 186, name: 'ID 186', hex: '0x7c6d7cff', price: 6000 },
  { id: 187, name: 'ID 187', hex: '0x020c02ff', price: 6000 },
  { id: 188, name: 'ID 188', hex: '0x072407ff', price: 6000 },
  { id: 189, name: 'ID 189', hex: '0x163012ff', price: 6000 },
  { id: 190, name: 'ID 190', hex: '0x16301bff', price: 6000 },
  { id: 191, name: 'ID 191', hex: '0x642b4fff', price: 6000 },
  { id: 192, name: 'ID 192', hex: '0x368452ff', price: 6000 },
  { id: 193, name: 'ID 193', hex: '0x999590ff', price: 6000 },
  { id: 194, name: 'ID 194', hex: '0x818d96ff', price: 6000 },
  { id: 195, name: 'ID 195', hex: '0x99991eff', price: 6000 },
  { id: 196, name: 'ID 196', hex: '0x7f994cff', price: 6000 },
  { id: 197, name: 'ID 197', hex: '0x839292ff', price: 6000 },
  { id: 198, name: 'ID 198', hex: '0x788222ff', price: 6000 },
  { id: 199, name: 'ID 199', hex: '0x2b3c99ff', price: 6000 },
  { id: 200, name: 'ID 200', hex: '0x3a3a0bff', price: 6000 },
  { id: 201, name: 'ID 201', hex: '0x8a794eff', price: 6000 },
  { id: 202, name: 'ID 202', hex: '0x0e1f49ff', price: 6000 },
  { id: 203, name: 'ID 203', hex: '0x15371cff', price: 6000 },
  { id: 204, name: 'ID 204', hex: '0x15273aff', price: 6000 },
  { id: 205, name: 'ID 205', hex: '0x375775ff', price: 6000 },
  { id: 206, name: 'ID 206', hex: '0x060820ff', price: 6000 },
  { id: 207, name: 'ID 207', hex: '0x071326ff', price: 6000 },
  { id: 208, name: 'ID 208', hex: '0x20394bff', price: 6000 },
  { id: 209, name: 'ID 209', hex: '0x2c5089ff', price: 6000 },
  { id: 210, name: 'ID 210', hex: '0x15426cff', price: 6000 },
  { id: 211, name: 'ID 211', hex: '0x103250ff', price: 6000 },
  { id: 212, name: 'ID 212', hex: '0x241663ff', price: 6000 },
  { id: 213, name: 'ID 213', hex: '0x692015ff', price: 6000 },
  { id: 214, name: 'ID 214', hex: '0x8c8d94ff', price: 6000 },
  { id: 215, name: 'ID 215', hex: '0x516013ff', price: 6000 },
  { id: 216, name: 'ID 216', hex: '0x090f02ff', price: 6000 },
  { id: 217, name: 'ID 217', hex: '0x8c573aff', price: 6000 },
  { id: 218, name: 'ID 218', hex: '0x52888eff', price: 6000 },
  { id: 219, name: 'ID 219', hex: '0x995c52ff', price: 6000 },
  { id: 220, name: 'ID 220', hex: '0x99581eff', price: 6000 },
  { id: 221, name: 'ID 221', hex: '0x993a63ff', price: 6000 },
  { id: 222, name: 'ID 222', hex: '0x998f4eff', price: 6000 },
  { id: 223, name: 'ID 223', hex: '0x99311eff', price: 6000 },
  { id: 224, name: 'ID 224', hex: '0x0d1842ff', price: 6000 },
  { id: 225, name: 'ID 225', hex: '0x521e1eff', price: 6000 },
  { id: 226, name: 'ID 226', hex: '0x42420dff', price: 6000 },
  { id: 227, name: 'ID 227', hex: '0x4c991eff', price: 6000 },
  { id: 228, name: 'ID 228', hex: '0x082a1dff', price: 6000 },
  { id: 229, name: 'ID 229', hex: '0x96821dff', price: 6000 },
  { id: 230, name: 'ID 230', hex: '0x197f19ff', price: 6000 },
  { id: 231, name: 'ID 231', hex: '0x3b141fff', price: 6000 },
  { id: 232, name: 'ID 232', hex: '0x745217ff', price: 6000 },
  { id: 233, name: 'ID 233', hex: '0x893f8dff', price: 6000 },
  { id: 234, name: 'ID 234', hex: '0x7e1a6cff', price: 6000 },
  { id: 235, name: 'ID 235', hex: '0x0b370bff', price: 6000 },
  { id: 236, name: 'ID 236', hex: '0x27450dff', price: 6000 },
  { id: 237, name: 'ID 237', hex: '0x071f24ff', price: 6000 },
  { id: 238, name: 'ID 238', hex: '0x784573ff', price: 6000 },
  { id: 239, name: 'ID 239', hex: '0x8a653aff', price: 6000 },
  { id: 240, name: 'ID 240', hex: '0x732617ff', price: 6000 },
  { id: 241, name: 'ID 241', hex: '0x319490ff', price: 6000 },
  { id: 242, name: 'ID 242', hex: '0x56941dff', price: 6000 },
  { id: 243, name: 'ID 243', hex: '0x59163dff', price: 6000 },
  { id: 244, name: 'ID 244', hex: '0x1b8a2fff', price: 6000 },
  { id: 245, name: 'ID 245', hex: '0x38160bff', price: 6000 },
  { id: 246, name: 'ID 246', hex: '0x041804ff', price: 6000 },
  { id: 247, name: 'ID 247', hex: '0x355d8eff', price: 6000 },
  { id: 248, name: 'ID 248', hex: '0x2e3f5bff', price: 6000 },
  { id: 249, name: 'ID 249', hex: '0x561a28ff', price: 6000 },
  { id: 250, name: 'ID 250', hex: '0x4e0e27ff', price: 6000 },
  { id: 251, name: 'ID 251', hex: '0x706c67ff', price: 6000 },
  { id: 252, name: 'ID 252', hex: '0x3b3e42ff', price: 6000 },
  { id: 253, name: 'ID 253', hex: '0x2e2d33ff', price: 6000 },
  { id: 254, name: 'ID 254', hex: '0x7b7e7dff', price: 6000 },
  { id: 255, name: 'ID 255', hex: '0x4a4442ff', price: 6000 },
  { id: 256, name: 'ID 256', hex: '0x28344eff', price: 6000 },
]

export interface ServiceCategory {
  id: string
  title: string
  items: ServiceItem[]
}

export const servicesData: ServiceCategory[] = [
  {
    id: 'main',
    title: 'Основные услуги',
    items: [
      { id: 1, name: 'Imbolazer', price: 4000, image: imbolazerImg, badge: 'SECURITY SYSTEM', description: 'Установка современной противоугонной системы с защитой от взлома и удаленным блокированием двигателя.' },
      { id: 2, name: 'GSM', price: 15000, image: gsmImg, badge: 'TELEMETRY CONTROL', description: 'Передовая GSM-телеметрия: запуск двигателя с телефона, трекинг координат и управление функциями авто.' },
    ]
  },
  {
    id: 'diagnostics',
    title: 'Диагностика',
    items: [
      { id: 3, name: 'Обслуживание двигателя', price: 6000, image: motorImg, badge: 'ENGINE CARE', description: 'Полная диагностика ДВС, замер компрессии, замена свечей зажигания, фильтров и профессиональная регулировка.' },
      { id: 4, name: 'Обслуживание топливной системы', price: 6000, image: fuelImg, badge: 'FUEL SYSTEM', description: 'Ультразвуковая чистка инжекторов, промывка топливной рампы, замена бензонасоса и калибровка впрыска.' },
      { id: 5, name: 'Обслуживание электроники', price: 6000, image: electroImg, badge: 'ELECTRICAL SYSTEM', description: 'Диагностика и ремонт бортового компьютера, датчиков, устранение неполадок проводки и прошивка ЭБУ.' },
    ]
  },
  {
    id: 'painting',
    title: 'Покрасочные работы',
    items: [
      { id: 6, name: 'Покрасочные работы 1', price: 45000, image: pokrskaImg, badge: 'STAGE 01 - MATTE', description: 'Нанесение износостойкой матовой основы, глубокая грунтовка и защитная обработка кузова от царапин.' },
      { id: 7, name: 'Покрасочные работы 2', price: 45000, image: pokrskaImg, badge: 'STAGE 02 - METALLIC', description: 'Высококлассное напыление металлика с зеркальными частицами, двойной слой прочного защитного лака.' },
      { id: 8, name: 'Покрасочные работы 3', price: 45000, image: pokrskaImg, badge: 'STAGE 03 - CANDY', description: 'Эксклюзивный многослойный Candy-окрас. Невероятная глубина цвета, перламутровые переливы и премиальный глянец.' },
    ]
  },
  {
    id: 'bumpers',
    title: 'Бампера',
    items: [
      { id: 9, name: 'ALIEN', price: 40000, image: alienImg, badge: 'CUSTOM BUMPER', description: 'Передний тюнинг-бампер Alien с агрессивными воздухозаборниками и сплиттером для максимального прижима.' },
      { id: 10, name: 'X-FLOW', price: 40000, image: xflowImg, badge: 'AERO BUMPER', description: 'Спортивный бампер X-Flow с оптимизированной аэродинамикой и интегрированными каналами охлаждения тормозов.' },
      { id: 11, name: 'Chrome', price: 40000, image: chromeImg, badge: 'CLASSIC BUMPER', description: 'Роскошный классический бампер из полированного зеркального хрома в лучших традициях лоурайдинга.' },
      { id: 12, name: 'Slamin', price: 40000, image: slaminImg, badge: 'STANCE BUMPER', description: 'Заниженный бампер Slamin для экстремального stance-силуэта с защитной губой.' },
      { id: 13, name: 'Решетка Chrome', price: 40000, image: reshetkaChromeImg, badge: 'CHROME GRILLE', description: 'Уникальная радиаторная решетка из высококачественного полированного хрома с классическим узором.' },
      { id: 14, name: 'Решетка Slamin', price: 40000, image: reshetkaSlaminImg, badge: 'STANCE GRILLE', description: 'Кастомная решетка радиатора Slamin в глубоком черном глянцевом исполнении для дерзкого внешнего вида.' },
    ]
  },
  {
    id: 'wheels',
    title: 'Колёсные диски',
    items: [
      { id: 15, name: 'Диски Offroad', price: 15000, image: offroadImg },
      { id: 16, name: 'Диски Shadow', price: 13000, image: shadowImg },
      { id: 17, name: 'Диски Mega', price: 13000, image: megaImg },
      { id: 18, name: 'Диски Rimshine', price: 13000, image: rimshineImg },
      { id: 19, name: 'Диски Wires', price: 12000, image: wiresImg },
      { id: 20, name: 'Диски Classic', price: 15000, image: classicImg },
      { id: 21, name: 'Диски Twist', price: 12000, image: twistImg },
      { id: 22, name: 'Диски Cutter', price: 15000, image: cuterImg },
      { id: 23, name: 'Диски Switch', price: 15000, image: switchImg },
      { id: 24, name: 'Диски Grove', price: 13000, image: grooveImg },
      { id: 25, name: 'Диски Import', price: 12000, image: importImg },
      { id: 26, name: 'Диски Dollar', price: 15000, image: dolarImg },
      { id: 27, name: 'Диски Trance', price: 12000, image: tranceImg },
      { id: 28, name: 'Диски Atomic', price: 13000, image: atomicImg },
      { id: 29, name: 'Диски Ahab', price: 13000, image: ahabImg },
      { id: 30, name: 'Диски Virtual', price: 12000, image: virtualImg },
      { id: 31, name: 'Диски Access', price: 12000, image: accesImg },
    ]
  },
  {
    id: 'spoilers',
    title: 'Спойлеры',
    items: [
      { id: 32, name: 'Alien', price: 30000, image: spoilerAlienImg, description: 'Агрессивный спойлер Alien — максимальный прижим на высоких скоростях. Карбоновое исполнение.' },
      { id: 33, name: 'X-Flow', price: 30000, image: spoilerXflowImg, description: 'Аэродинамический спойлер X-Flow — оптимальный баланс стиля и функциональности.' },
    ]
  },
  {
    id: 'roof',
    title: 'Крыша',
    items: [
      { id: 34, name: 'Крыша Alien Roof Vent', price: 30000, image: krishaAlienImg, description: 'Вентиляционная крыша Alien с агрессивными прорезями — улучшает охлаждение салона.' },
      { id: 35, name: 'Крыша X-Flow Roof Vent', price: 30000, image: krishaXflowImg, description: 'Вентиляционная крыша X-Flow с плавными воздуховодами для снижения аэродинамического сопротивления.' },
      { id: 36, name: 'Крыша Alien', price: 30000, image: krishaAlienImg, description: 'Стандартная крыша Alien — сглаженный агрессивный силуэт без лишних деталей.' },
      { id: 37, name: 'Крыша X-Flow', price: 30000, image: krishaXflowImg, description: 'Стандартная крыша X-Flow с чистыми спортивными линиями.' },
      { id: 38, name: 'Крыша Convertible', price: 30000, image: krishaAlienImg, description: 'Съёмная крыша-кабриолет. Открытый стиль вождения с сохранением жёсткости кузова.' },
      { id: 39, name: 'Крыша Vinyl Hardtop', price: 30000, image: krishaXflowImg, description: 'Жёсткий верх с виниловым покрытием — классика лоурайдинга.' },
      { id: 40, name: 'Крыша Hardtop', price: 30000, image: krishaAlienImg, description: 'Стальной хардтоп — прочность и защита в любых условиях.' },
      { id: 41, name: 'Крыша Softtop', price: 30000, image: krishaXflowImg, description: 'Мягкий складной верх — элегантность и лёгкость кузова.' },
    ]
  },
  {
    id: 'exhaust',
    title: 'Выхлопные системы',
    items: [
      { id: 42, name: 'Выхлоп Alien', price: 30000, image: vihlopAlienImg, description: 'Двойная выхлопная система Alien — мощный рёв мотора и прирост мощности.' },
      { id: 43, name: 'Выхлоп X-Flow', price: 30000, image: vihlopXflowImg, description: 'Система X-Flow с прямоточными коллекторами — максимальная пропускная способность.' },
      { id: 44, name: 'Выхлоп Chrome', price: 25000, image: vihlopAlienImg, description: 'Хромированные насадки — блестящий акцент классического тюнинга.' },
      { id: 45, name: 'Выхлоп Slamin', price: 25000, image: vihlopXflowImg, description: 'Низкопрофильная система Slamin — идеал для stance-сборки.' },
      { id: 46, name: 'Выхлоп Chrome Exhaust', price: 25000, image: vihlopAlienImg, description: 'Полная хромированная система с резонатором для сочного звука.' },
      { id: 47, name: 'Выхлоп Slamin Exhaust', price: 25000, image: vihlopXflowImg, description: 'Полная система Slamin с регулировкой тембра выхлопа.' },
    ]
  }
]

// ─────────────────────────────────────────────
// Вспомогательный компонент: иконка-SVG для витрин без картинки
// ─────────────────────────────────────────────

const ShowcaseIcon = ({ type }: { type: 'spoiler' | 'roof' | 'exhaust' }) => {
  if (type === 'spoiler') {
    return (
      <svg width="140" height="90" viewBox="0 0 140 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="15" y="58" width="110" height="7" rx="3" fill="rgba(200,168,130,0.12)" stroke="rgba(200,168,130,0.45)" strokeWidth="1.2"/>
        <path d="M25 58 Q35 22 70 20 Q105 22 115 58" stroke="rgba(200,168,130,0.7)" strokeWidth="2" fill="rgba(200,168,130,0.07)"/>
        <rect x="26" y="62" width="7" height="16" rx="2" fill="rgba(200,168,130,0.35)"/>
        <rect x="107" y="62" width="7" height="16" rx="2" fill="rgba(200,168,130,0.35)"/>
        <line x1="29" y1="62" x2="29" y2="78" stroke="rgba(200,168,130,0.2)" strokeWidth="1"/>
        <line x1="111" y1="62" x2="111" y2="78" stroke="rgba(200,168,130,0.2)" strokeWidth="1"/>
        <text x="70" y="52" textAnchor="middle" fontSize="8" fill="rgba(200,168,130,0.5)" fontFamily="monospace" letterSpacing="3">AERO</text>
      </svg>
    )
  }
  if (type === 'roof') {
    return (
      <svg width="140" height="90" viewBox="0 0 140 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="55" width="120" height="10" rx="2" fill="rgba(200,168,130,0.10)" stroke="rgba(200,168,130,0.35)" strokeWidth="1"/>
        <path d="M28 55 Q40 20 70 18 Q100 20 112 55" stroke="rgba(200,168,130,0.7)" strokeWidth="2" fill="rgba(200,168,130,0.08)"/>
        <line x1="40" y1="55" x2="40" y2="65" stroke="rgba(200,168,130,0.25)" strokeWidth="1"/>
        <line x1="70" y1="55" x2="70" y2="65" stroke="rgba(200,168,130,0.25)" strokeWidth="1"/>
        <line x1="100" y1="55" x2="100" y2="65" stroke="rgba(200,168,130,0.25)" strokeWidth="1"/>
        <circle cx="28" cy="55" r="3" fill="rgba(200,168,130,0.4)"/>
        <circle cx="112" cy="55" r="3" fill="rgba(200,168,130,0.4)"/>
        <text x="70" y="44" textAnchor="middle" fontSize="8" fill="rgba(200,168,130,0.5)" fontFamily="monospace" letterSpacing="3">ROOF</text>
      </svg>
    )
  }
  // exhaust
  return (
    <svg width="140" height="90" viewBox="0 0 140 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="38" width="80" height="14" rx="4" fill="rgba(200,168,130,0.08)" stroke="rgba(200,168,130,0.4)" strokeWidth="1.2"/>
      <rect x="100" y="34" width="22" height="22" rx="11" fill="none" stroke="rgba(200,168,130,0.6)" strokeWidth="1.5"/>
      <circle cx="111" cy="45" r="6" fill="rgba(200,168,130,0.12)" stroke="rgba(200,168,130,0.45)" strokeWidth="1"/>
      <path d="M118 35 Q128 30 132 22" stroke="rgba(200,168,130,0.35)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M120 38 Q132 35 136 28" stroke="rgba(200,168,130,0.25)" strokeWidth="1" strokeLinecap="round"/>
      <path d="M120 42 Q134 42 138 36" stroke="rgba(200,168,130,0.18)" strokeWidth="1" strokeLinecap="round"/>
      <text x="60" y="68" textAnchor="middle" fontSize="8" fill="rgba(200,168,130,0.5)" fontFamily="monospace" letterSpacing="3">EXHAUST</text>
    </svg>
  )
}

// ─────────────────────────────────────────────
// Вспомогательный компонент: карточка-тумб для витрины без картинки
// ─────────────────────────────────────────────

const TextThumbCard = ({
  item,
  isActive,
  onClick,
  labelPrefix = '',
}: {
  item: ServiceItem
  isActive: boolean
  onClick: () => void
  labelPrefix?: string
}) => {
  const shortName = item.name.replace(labelPrefix, '').trim()
  return (
    <div
      className={`wheel-thumb-card ${isActive ? 'active' : ''}`}
      onClick={onClick}
      style={{ minHeight: 80, justifyContent: 'center', gap: 6 }}
    >
      <div style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        border: `1px solid ${isActive ? 'var(--primary)' : 'rgba(200,168,130,0.2)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isActive ? 'rgba(200,168,130,0.1)' : 'transparent',
        transition: 'all 0.2s ease',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-condensed)', color: isActive ? 'var(--primary)' : 'rgba(200,168,130,0.5)', fontWeight: 700, letterSpacing: '0.05em' }}>
          {shortName.slice(0, 2).toUpperCase()}
        </span>
      </div>
      <div style={{ fontSize: '0.72rem', fontWeight: 500, color: isActive ? 'var(--primary)' : 'var(--white)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', textAlign: 'center' }}>
        {shortName}
      </div>
      <div style={{ fontSize: '0.68rem', color: 'var(--gray-light)' }}>${item.price.toLocaleString()}</div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Компонент: превью-бокс без картинки (красивый)
// ─────────────────────────────────────────────

const IconPreviewBox = ({
  type,
  label,
  name,
  sublabel,
  stats,
}: {
  type: 'spoiler' | 'roof' | 'exhaust'
  label: string
  name: string
  sublabel: string
  stats: { key: string; val: string }[]
}) => (
  <div className="wheel-preview-box" style={{ flexDirection: 'column', gap: 0, background: '#0e0e10', position: 'relative', overflow: 'hidden' }}>
    {/* Фоновая сетка */}
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: 'repeating-linear-gradient(0deg, rgba(200,168,130,0.03) 0px, transparent 1px, transparent 36px), repeating-linear-gradient(90deg, rgba(200,168,130,0.03) 0px, transparent 1px, transparent 36px)',
      pointerEvents: 'none',
    }} />
    {/* Центральный контент */}
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, zIndex: 1, padding: '28px 24px 16px' }}>
      <ShowcaseIcon type={type} />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-heading)', letterSpacing: '0.08em', lineHeight: 1.1 }}>
          {name}
        </div>
        <div style={{ fontSize: '0.72rem', color: 'rgba(200,168,130,0.45)', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: 4 }}>
          {sublabel}
        </div>
      </div>
    </div>
    {/* Статы */}
    <div style={{ display: 'flex', gap: 1, width: '100%', borderTop: '1px solid rgba(200,168,130,0.1)', zIndex: 1 }}>
      {stats.map((s) => (
        <div key={s.key} style={{ flex: 1, padding: '10px 8px', textAlign: 'center', borderRight: '1px solid rgba(200,168,130,0.08)' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-condensed)' }}>{s.val}</div>
          <div style={{ fontSize: '0.62rem', color: 'rgba(200,168,130,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>{s.key}</div>
        </div>
      ))}
    </div>
    {/* Лейбл */}
    <div style={{ position: 'absolute', bottom: 52, left: 16, background: 'rgba(0,0,0,0.85)', border: '1px solid rgba(200,168,130,0.3)', padding: '4px 12px', fontSize: '0.72rem', fontFamily: 'var(--font-condensed)', letterSpacing: '0.06em', color: 'var(--primary)', textTransform: 'uppercase', zIndex: 2 }}>
      {label}
    </div>
  </div>
)

// ─────────────────────────────────────────────
// Главный компонент
// ─────────────────────────────────────────────

export default function Services() {
  const [activeFilter, setActiveFilter] = useState<string>('all')

  const wheelsCategory = servicesData.find(cat => cat.id === 'wheels')
  const spoilersCategory = servicesData.find(cat => cat.id === 'spoilers')
  const roofCategory = servicesData.find(cat => cat.id === 'roof')
  const exhaustCategory = servicesData.find(cat => cat.id === 'exhaust')

  const [selectedWheel, setSelectedWheel] = useState<ServiceItem | null>(wheelsCategory?.items[0] || null)
  const [selectedSpoiler, setSelectedSpoiler] = useState<ServiceItem | null>(spoilersCategory?.items[0] || null)
  const [selectedRoof, setSelectedRoof] = useState<ServiceItem | null>(roofCategory?.items[0] || null)
  const [selectedExhaust, setSelectedExhaust] = useState<ServiceItem | null>(exhaustCategory?.items[0] || null)
  const [selectedColor, setSelectedColor] = useState<ColorItem | null>(gtasaColors[0] || null)

  const filters = [
    { id: 'all', label: 'Все услуги' },
    { id: 'main', label: 'Основные' },
    { id: 'diagnostics', label: 'Диагностика' },
    { id: 'painting', label: 'Покраска' },
    { id: 'bumpers', label: 'Бампера' },
    { id: 'wheels', label: 'Колёса' },
    { id: 'spoilers', label: 'Спойлеры' },
    { id: 'roof', label: 'Крыша' },
    { id: 'exhaust', label: 'Выхлоп' },
    { id: 'colors', label: 'Цвета GTA' },
  ]

  const filteredCategories = activeFilter === 'all'
    ? servicesData
    : servicesData.filter(cat => cat.id === activeFilter)

  const showcaseCategoryIds = ['wheels', 'spoilers', 'roof', 'exhaust', 'colors']

  const hexToCss = (hex: string) => '#' + hex.replace(/^0x/, '').slice(0, 6)

  // Общий заголовок секции
  const SectionTitle = ({ title }: { title: string }) => (
    <h2 style={{
      fontSize: '1.6rem',
      marginBottom: 30,
      color: 'var(--white)',
      borderBottom: '2px solid var(--primary)',
      paddingBottom: 12,
      fontFamily: 'var(--font-heading)',
      letterSpacing: '0.1em',
    }}>
      {title}
    </h2>
  )

  // Общая нижняя часть витрины (инфо + кнопка)
  const ShowcaseInfo = ({
    name,
    subtitle,
    priceLabel,
    price,
    bookingPath,
    bookingLabel,
  }: {
    name: string
    subtitle: string
    priceLabel: string
    price: number
    bookingPath: string
    bookingLabel: string
  }) => (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h3 style={{ fontSize: '1.8rem', color: 'var(--white)', marginBottom: 4, letterSpacing: '0.05em', fontFamily: 'var(--font-heading)' }}>{name}</h3>
          <p style={{ color: 'var(--gray-light)', fontSize: '0.9rem' }}>{subtitle}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)', fontSize: '2.2rem', lineHeight: '1', textShadow: '0 0 10px rgba(200,168,130,0.3)' }}>
            ${price.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--gray-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{priceLabel}</span>
        </div>
      </div>
      <button
        className="btn btn-primary"
        style={{ width: '100%', padding: '16px 0', fontSize: '1rem' }}
        onClick={() => window.location.href = bookingPath}
      >
        {bookingLabel}
      </button>
    </>
  )

  return (
    <section className="section">
      <div className="container">
        <style dangerouslySetInnerHTML={{ __html: `
          .premium-service-card {
            background: linear-gradient(135deg, rgba(28,28,30,0.8) 0%, rgba(16,16,18,0.98) 100%);
            border: 1px solid rgba(200,168,130,0.12);
            border-radius: 2px;
            overflow: hidden;
            position: relative;
            transition: all 0.35s cubic-bezier(0.25,1,0.5,1);
            box-shadow: 0 15px 35px rgba(0,0,0,0.6);
            display: flex;
            flex-direction: column;
            height: 100%;
          }
          .premium-service-card:hover {
            transform: translateY(-6px);
            border-color: var(--primary);
            box-shadow: 0 20px 40px rgba(200,168,130,0.18);
          }
          .premium-service-card::after {
            content: '';
            position: absolute;
            top: 0; left: -150%;
            width: 50%; height: 100%;
            background: linear-gradient(to right, transparent, rgba(200,168,130,0.15), transparent);
            transform: skewX(-20deg);
            transition: 0.85s ease-in-out;
            pointer-events: none;
            z-index: 3;
          }
          .premium-service-card:hover::after { left: 200%; }
          .premium-card-img-wrapper {
            position: relative; width: 100%; height: 220px;
            overflow: hidden; background: #0b0b0b;
            border-bottom: 1px solid rgba(200,168,130,0.08);
          }
          .premium-card-img-wrapper img {
            width: 100%; height: 100%; object-fit: cover;
            transition: transform 0.6s cubic-bezier(0.25,1,0.5,1);
          }
          .premium-service-card:hover .premium-card-img-wrapper img { transform: scale(1.08); }
          .premium-card-badge {
            position: absolute; top: 16px; left: 16px;
            background: rgba(10,10,12,0.9);
            border: 1px solid var(--primary);
            color: var(--primary);
            padding: 5px 12px;
            font-family: var(--font-condensed);
            font-size: 0.72rem; letter-spacing: 0.08em;
            text-transform: uppercase; font-weight: 700;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5); z-index: 2;
          }
          .premium-card-content {
            padding: 24px; display: flex; flex-direction: column;
            flex-grow: 1; justify-content: space-between; gap: 16px;
          }
          .premium-card-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
          .premium-card-title { font-family: var(--font-heading); font-size: 1.45rem; letter-spacing: 0.05em; color: var(--white); line-height: 1.1; margin: 0; }
          .premium-card-price { color: var(--primary); font-family: var(--font-heading); font-size: 1.6rem; line-height: 1; text-shadow: 0 0 10px rgba(200,168,130,0.35); }
          .premium-card-desc { font-size: 0.88rem; color: var(--gray-light); line-height: 1.5; margin: 0; }
          .premium-card-btn {
            width: 100%; padding: 12px 0; font-size: 0.85rem;
            background: transparent; border: 1px solid var(--primary);
            color: var(--primary); transition: all 0.25s ease;
            font-family: var(--font-condensed); text-transform: uppercase;
            font-weight: 700; letter-spacing: 0.08em; cursor: pointer;
            text-align: center; border-radius: 2px; margin-top: auto;
          }
          .premium-service-card:hover .premium-card-btn { background: var(--primary); color: var(--black); box-shadow: 0 0 12px rgba(200,168,130,0.25); }
          .paint-stage-bar { width: 100%; height: 4px; background: rgba(255,255,255,0.05); position: relative; margin-top: 6px; border-radius: 2px; }
          .paint-stage-progress { height: 100%; background: var(--primary); border-radius: 2px; box-shadow: 0 0 8px var(--primary); }
          .wheel-showcase-container {
            display: grid; grid-template-columns: 1fr 1.2fr; gap: 40px;
            background: linear-gradient(135deg, rgba(26,26,26,0.6) 0%, rgba(13,13,13,0.8) 100%);
            border: 1px solid rgba(200,168,130,0.15); border-radius: 4px;
            padding: 40px; position: relative; overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.6); margin-bottom: 60px;
          }
          .wheel-showcase-container::before {
            content: ''; position: absolute; top: -50%; left: -50%;
            width: 200%; height: 200%;
            background: radial-gradient(circle, rgba(200,168,130,0.04) 0%, transparent 60%);
            pointer-events: none;
          }
          @media (max-width: 992px) { .wheel-showcase-container { grid-template-columns: 1fr; padding: 24px; } }
          .wheel-preview-box {
            position: relative; width: 100%; height: 320px;
            background: radial-gradient(circle, #222 0%, #111 100%);
            border: 1px solid rgba(255,255,255,0.03); border-radius: 2px;
            display: flex; justify-content: center; align-items: center;
            overflow: hidden; box-shadow: inset 0 0 30px rgba(0,0,0,0.9);
          }
          .wheel-image-glow {
            filter: drop-shadow(0 0 25px rgba(200,168,130,0.25));
            max-height: 80%; max-width: 80%; object-fit: contain;
            animation: wheelSpinIn 0.8s cubic-bezier(0.25,1,0.5,1) both;
          }
          @keyframes wheelSpinIn {
            0% { transform: rotate(-180deg) scale(0.3); opacity: 0; }
            100% { transform: rotate(0deg) scale(1); opacity: 1; }
          }
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(8px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .wheel-thumb-grid {
            display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
            gap: 12px; max-height: 320px; overflow-y: auto; padding-right: 8px;
          }
          .wheel-thumb-grid::-webkit-scrollbar { width: 4px; }
          .wheel-thumb-grid::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
          .wheel-thumb-grid::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 2px; }
          .wheel-thumb-card {
            background: #181818; border: 1px solid rgba(250,250,250,0.05);
            border-radius: 2px; padding: 10px; text-align: center;
            cursor: pointer; transition: all 0.25s ease;
            display: flex; flex-direction: column; justify-content: space-between;
            align-items: center; min-height: 105px;
          }
          .wheel-thumb-card:hover { border-color: rgba(200,168,130,0.5); transform: translateY(-2px); background: #202020; }
          .wheel-thumb-card.active { border-color: var(--primary); background: rgba(200,168,130,0.08); box-shadow: 0 0 15px rgba(200,168,130,0.15); }
          .premium-select-wrapper { position: relative; margin-bottom: 24px; width: 100%; }
          .premium-select {
            appearance: none; width: 100%; padding: 14px 20px; font-size: 1rem;
            border: 1px solid rgba(200,168,130,0.4); background: #141414;
            color: var(--white); cursor: pointer; outline: none;
            font-family: var(--font-condensed); letter-spacing: 0.05em; transition: all 0.25s ease;
          }
          .premium-select:focus { border-color: var(--primary); box-shadow: 0 0 10px rgba(200,168,130,0.25); }
          .premium-select-wrapper::after { content: '▼'; font-size: 0.75rem; color: var(--primary); right: 20px; top: 50%; transform: translateY(-50%); position: absolute; pointer-events: none; }
          .color-showcase-container {
            display: grid; grid-template-columns: 1fr 1.5fr; gap: 40px;
            background: linear-gradient(135deg, rgba(26,26,26,0.6) 0%, rgba(13,13,13,0.8) 100%);
            border: 1px solid rgba(200,168,130,0.15); border-radius: 4px;
            padding: 40px; position: relative; overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.6); margin-bottom: 60px;
          }
          .color-showcase-container::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(200,168,130,0.04) 0%, transparent 60%); pointer-events: none; }
          @media (max-width: 992px) { .color-showcase-container { grid-template-columns: 1fr; padding: 24px; } }
          .color-preview-box { position: relative; width: 100%; height: 320px; border: 1px solid rgba(255,255,255,0.08); border-radius: 2px; display: flex; justify-content: center; align-items: center; overflow: hidden; box-shadow: inset 0 0 40px rgba(0,0,0,0.6), 0 0 20px rgba(0,0,0,0.4); transition: background 0.3s ease; }
          .color-preview-label { position: absolute; bottom: 16px; left: 16px; background: rgba(0,0,0,0.85); border: 1px solid rgba(200,168,130,0.4); padding: 6px 14px; font-size: 0.8rem; font-family: var(--font-condensed); letter-spacing: 0.05em; color: var(--primary); text-transform: uppercase; }
          .color-cube-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(42px, 1fr)); gap: 6px; max-height: 360px; overflow-y: auto; padding-right: 8px; }
          .color-cube-grid::-webkit-scrollbar { width: 4px; }
          .color-cube-grid::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
          .color-cube-grid::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 2px; }
          .color-cube { width: 100%; aspect-ratio: 1; border-radius: 3px; cursor: pointer; border: 2px solid transparent; transition: all 0.15s ease; box-shadow: 0 2px 6px rgba(0,0,0,0.4); }
          .color-cube:hover { transform: scale(1.15); border-color: var(--primary); z-index: 2; box-shadow: 0 4px 12px rgba(0,0,0,0.5); }
          .color-cube.active { border-color: var(--white); box-shadow: 0 0 0 2px var(--primary), 0 4px 12px rgba(0,0,0,0.5); transform: scale(1.1); z-index: 2; }
        ` }} />

        <h1 className="section-title">Услуги</h1>

        {/* Фильтры */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 40 }}>
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`btn btn-sm ${activeFilter === f.id ? 'btn-primary' : 'btn-outline'}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ── Стандартные категории (карточки с картинками) ── */}
        {filteredCategories.filter(cat => !showcaseCategoryIds.includes(cat.id)).map(category => (
          <div key={category.id} style={{ marginBottom: 60 }}>
            <SectionTitle title={category.title} />
            <div className="grid-2">
              {category.items.map((item, i) => (
                <div
                  key={item.id}
                  className="premium-service-card"
                  style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.05}s both` }}
                >
                  {item.image && (
                    <div className="premium-card-img-wrapper">
                      <img src={item.image} alt={item.name} />
                      {item.badge && <div className="premium-card-badge">{item.badge}</div>}
                    </div>
                  )}
                  <div className="premium-card-content">
                    <div className="premium-card-header">
                      <h3 className="premium-card-title">{item.name}</h3>
                      <div className="premium-card-price">${item.price.toLocaleString()}</div>
                    </div>
                    {item.description && <p className="premium-card-desc">{item.description}</p>}
                    {category.id === 'painting' && (
                      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--gray-light)', textTransform: 'uppercase', fontFamily: 'var(--font-condensed)', letterSpacing: '0.05em' }}>
                          <span>Глубина лака / Сложность</span>
                          <span style={{ color: 'var(--primary)' }}>
                            {item.name.includes('1') ? '35%' : item.name.includes('2') ? '70%' : '100%'}
                          </span>
                        </div>
                        <div className="paint-stage-bar">
                          <div className="paint-stage-progress" style={{ width: item.name.includes('1') ? '35%' : item.name.includes('2') ? '70%' : '100%' }} />
                        </div>
                      </div>
                    )}
                    <button
                      className="premium-card-btn"
                      onClick={() => window.location.href = `/booking?service=${category.id}&item=${encodeURIComponent(item.name)}`}
                    >
                      Заказать услугу
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* ── ВИТРИНА: КОЛЁСНЫЕ ДИСКИ (с картинками) ── */}
        {filteredCategories.some(cat => cat.id === 'wheels') && wheelsCategory && selectedWheel && (
          <div style={{ marginBottom: 60 }}>
            <SectionTitle title={wheelsCategory.title} />
            <div className="wheel-showcase-container">
              {/* Левая колонка */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div className="wheel-preview-box">
                  <img key={selectedWheel.id} src={selectedWheel.image} alt={selectedWheel.name} className="wheel-image-glow" />
                  <div style={{ position: 'absolute', bottom: 16, left: 16, background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(200,168,130,0.3)', padding: '4px 12px', fontSize: '0.75rem', fontFamily: 'var(--font-condensed)', letterSpacing: '0.05em', color: 'var(--primary)', textTransform: 'uppercase' }}>
                    Визуализация дисков
                  </div>
                </div>
                <ShowcaseInfo
                  name={selectedWheel.name}
                  subtitle="Премиальные диски LS CUSTOMS"
                  priceLabel="Стоимость установки"
                  price={selectedWheel.price}
                  bookingPath={`/booking?service=wheels&item=${encodeURIComponent(selectedWheel.name)}`}
                  bookingLabel={`Заказать ${selectedWheel.name}`}
                />
              </div>
              {/* Правая колонка */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--gray-light)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-condensed)', marginBottom: 10 }}>Выберите диск из списка:</label>
                <div className="premium-select-wrapper">
                  <select className="premium-select" value={selectedWheel.id} onChange={e => {
                    const item = wheelsCategory.items.find(w => w.id === Number(e.target.value))
                    if (item) setSelectedWheel(item)
                  }}>
                    {wheelsCategory.items.map(w => <option key={w.id} value={w.id}>{w.name} — ${w.price.toLocaleString()}</option>)}
                  </select>
                </div>
                <label style={{ fontSize: '0.85rem', color: 'var(--gray-light)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-condensed)', marginBottom: 16 }}>Каталог дисков ({wheelsCategory.items.length}):</label>
                <div className="wheel-thumb-grid">
                  {wheelsCategory.items.map(item => (
                    <div key={item.id} className={`wheel-thumb-card ${selectedWheel.id === item.id ? 'active' : ''}`} onClick={() => setSelectedWheel(item)}>
                      <div style={{ width: '100%', height: 55, display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 6 }}>
                        <img src={item.image} alt={item.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', filter: selectedWheel.id === item.id ? 'drop-shadow(0 0 5px rgba(200,168,130,0.4))' : 'grayscale(20%)' }} />
                      </div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 500, color: selectedWheel.id === item.id ? 'var(--primary)' : 'var(--white)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', textAlign: 'center' }}>
                        {item.name.replace('Диски ', '')}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--gray-light)', marginTop: 2 }}>${item.price.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ВИТРИНА: СПОЙЛЕРЫ ── */}
        {filteredCategories.some(cat => cat.id === 'spoilers') && spoilersCategory && selectedSpoiler && (
          <div style={{ marginBottom: 60 }}>
            <SectionTitle title={spoilersCategory.title} />
            <div className="wheel-showcase-container">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <IconPreviewBox
                  type="spoiler"
                  label="Аэродинамика"
                  name={`Спойлер ${selectedSpoiler.name}`}
                  sublabel="Аэродинамический элемент"
                  stats={[
                    { key: 'Прижим', val: '+18%' },
                    { key: 'Материал', val: 'Carbon' },
                    { key: 'Монтаж', val: '2–3 ч' },
                  ]}
                />
                <ShowcaseInfo
                  name={`Спойлер ${selectedSpoiler.name}`}
                  subtitle={selectedSpoiler.description || 'Аэродинамические элементы премиум-класса'}
                  priceLabel="Установка и настройка"
                  price={selectedSpoiler.price}
                  bookingPath={`/booking?service=spoilers&item=${encodeURIComponent(selectedSpoiler.name)}`}
                  bookingLabel={`Заказать спойлер ${selectedSpoiler.name}`}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--gray-light)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-condensed)', marginBottom: 10 }}>Выберите модификацию:</label>
                <div className="premium-select-wrapper">
                  <select className="premium-select" value={selectedSpoiler.id} onChange={e => {
                    const item = spoilersCategory.items.find(s => s.id === Number(e.target.value))
                    if (item) setSelectedSpoiler(item)
                  }}>
                    {spoilersCategory.items.map(s => <option key={s.id} value={s.id}>{s.name} — ${s.price.toLocaleString()}</option>)}
                  </select>
                </div>
                <label style={{ fontSize: '0.85rem', color: 'var(--gray-light)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-condensed)', marginBottom: 16 }}>Доступные варианты ({spoilersCategory.items.length}):</label>
                <div className="wheel-thumb-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))' }}>
                  {spoilersCategory.items.map(item => (
                    <TextThumbCard key={item.id} item={item} isActive={selectedSpoiler.id === item.id} onClick={() => setSelectedSpoiler(item)} />
                  ))}
                </div>
                {/* Описание выбранного */}
                {selectedSpoiler.description && (
                  <div style={{ marginTop: 20, padding: '16px 20px', background: 'rgba(200,168,130,0.05)', border: '1px solid rgba(200,168,130,0.12)', borderRadius: 2 }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-condensed)', marginBottom: 6 }}>О модификации</div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--gray-light)', lineHeight: 1.6, margin: 0 }}>{selectedSpoiler.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── ВИТРИНА: КРЫША ── */}
        {filteredCategories.some(cat => cat.id === 'roof') && roofCategory && selectedRoof && (
          <div style={{ marginBottom: 60 }}>
            <SectionTitle title={roofCategory.title} />
            <div className="wheel-showcase-container">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <IconPreviewBox
                  type="roof"
                  label="Кузовные работы"
                  name={selectedRoof.name}
                  sublabel="Модификация крыши"
                  stats={[
                    { key: 'Вес', val: '−3 кг' },
                    { key: 'Тип', val: selectedRoof.name.includes('Vent') ? 'Vented' : selectedRoof.name.includes('Soft') ? 'Soft' : 'Hard' },
                    { key: 'Монтаж', val: '3–5 ч' },
                  ]}
                />
                <ShowcaseInfo
                  name={selectedRoof.name}
                  subtitle={selectedRoof.description || 'Кастомное исполнение и облегчённые материалы кузова'}
                  priceLabel="Стоимость работ"
                  price={selectedRoof.price}
                  bookingPath={`/booking?service=roof&item=${encodeURIComponent(selectedRoof.name)}`}
                  bookingLabel={`Заказать: ${selectedRoof.name}`}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--gray-light)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-condensed)', marginBottom: 10 }}>Выберите тип крыши:</label>
                <div className="premium-select-wrapper">
                  <select className="premium-select" value={selectedRoof.id} onChange={e => {
                    const item = roofCategory.items.find(r => r.id === Number(e.target.value))
                    if (item) setSelectedRoof(item)
                  }}>
                    {roofCategory.items.map(r => <option key={r.id} value={r.id}>{r.name} — ${r.price.toLocaleString()}</option>)}
                  </select>
                </div>
                <label style={{ fontSize: '0.85rem', color: 'var(--gray-light)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-condensed)', marginBottom: 16 }}>Полный каталог ({roofCategory.items.length}):</label>
                <div className="wheel-thumb-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}>
                  {roofCategory.items.map(item => (
                    <TextThumbCard key={item.id} item={item} isActive={selectedRoof.id === item.id} onClick={() => setSelectedRoof(item)} labelPrefix="Крыша " />
                  ))}
                </div>
                {selectedRoof.description && (
                  <div style={{ marginTop: 20, padding: '16px 20px', background: 'rgba(200,168,130,0.05)', border: '1px solid rgba(200,168,130,0.12)', borderRadius: 2 }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-condensed)', marginBottom: 6 }}>О модификации</div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--gray-light)', lineHeight: 1.6, margin: 0 }}>{selectedRoof.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── ВИТРИНА: ВЫХЛОПНЫЕ СИСТЕМЫ ── */}
        {filteredCategories.some(cat => cat.id === 'exhaust') && exhaustCategory && selectedExhaust && (
          <div style={{ marginBottom: 60 }}>
            <SectionTitle title={exhaustCategory.title} />
            <div className="wheel-showcase-container">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <IconPreviewBox
                  type="exhaust"
                  label="Выхлопная система"
                  name={selectedExhaust.name}
                  sublabel="Спортивная система"
                  stats={[
                    { key: 'Мощность', val: '+12 л.с.' },
                    { key: 'Материал', val: selectedExhaust.name.includes('Chrome') ? 'Chrome' : 'Steel' },
                    { key: 'Монтаж', val: '2–4 ч' },
                  ]}
                />
                <ShowcaseInfo
                  name={selectedExhaust.name}
                  subtitle={selectedExhaust.description || 'Спортивные выхлопные системы с регулировкой звука'}
                  priceLabel="Монтаж и калибровка"
                  price={selectedExhaust.price}
                  bookingPath={`/booking?service=exhaust&item=${encodeURIComponent(selectedExhaust.name)}`}
                  bookingLabel={`Заказать ${selectedExhaust.name}`}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--gray-light)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-condensed)', marginBottom: 10 }}>Выберите систему:</label>
                <div className="premium-select-wrapper">
                  <select className="premium-select" value={selectedExhaust.id} onChange={e => {
                    const item = exhaustCategory.items.find(ex => ex.id === Number(e.target.value))
                    if (item) setSelectedExhaust(item)
                  }}>
                    {exhaustCategory.items.map(ex => <option key={ex.id} value={ex.id}>{ex.name} — ${ex.price.toLocaleString()}</option>)}
                  </select>
                </div>
                <label style={{ fontSize: '0.85rem', color: 'var(--gray-light)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-condensed)', marginBottom: 16 }}>Варианты систем ({exhaustCategory.items.length}):</label>
                <div className="wheel-thumb-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}>
                  {exhaustCategory.items.map(item => (
                    <TextThumbCard key={item.id} item={item} isActive={selectedExhaust.id === item.id} onClick={() => setSelectedExhaust(item)} labelPrefix="Выхлоп " />
                  ))}
                </div>
                {selectedExhaust.description && (
                  <div style={{ marginTop: 20, padding: '16px 20px', background: 'rgba(200,168,130,0.05)', border: '1px solid rgba(200,168,130,0.12)', borderRadius: 2 }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-condensed)', marginBottom: 6 }}>О системе</div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--gray-light)', lineHeight: 1.6, margin: 0 }}>{selectedExhaust.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── ВИТРИНА: ЦВЕТА GTA ── */}
        {(activeFilter === 'all' || activeFilter === 'colors') && selectedColor && (
          <div style={{ marginBottom: 50 }}>
            <SectionTitle title="Палитра" />
            <div className="color-showcase-container">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div className="color-preview-box" style={{ background: hexToCss(selectedColor.hex) }}>
                  <div className="color-preview-label">ID {selectedColor.id} — {selectedColor.hex}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                  <div>
                    <h3 style={{ fontSize: '1.8rem', color: 'var(--white)', marginBottom: 4, letterSpacing: '0.05em', fontFamily: 'var(--font-heading)' }}>{selectedColor.name}</h3>
                    <p style={{ color: 'var(--gray-light)', fontSize: '0.9rem' }}>Покраска авто в выбранный цвет</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)', fontSize: '2.2rem', lineHeight: '1', textShadow: '0 0 10px rgba(200,168,130,0.3)' }}>
                      ${selectedColor.price.toLocaleString()}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gray-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Покраска в выбранный цвет</span>
                  </div>
                </div>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '16px 0', fontSize: '1rem' }}
                  onClick={() => window.location.href = `/booking?service=colors&item=${encodeURIComponent(selectedColor.name)}&colorId=${selectedColor.id}&hex=${encodeURIComponent(selectedColor.hex)}`}
                >
                  Заказать покраску {selectedColor.name}
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--gray-light)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-condensed)', marginBottom: 10 }}>Выберите цвет из списка:</label>
                <div className="premium-select-wrapper">
                  <select className="premium-select" value={selectedColor.id} onChange={e => {
                    const item = gtasaColors.find(c => c.id === Number(e.target.value))
                    if (item) setSelectedColor(item)
                  }}>
                    {gtasaColors.map(c => <option key={c.id} value={c.id}>{c.name} — {c.hex}</option>)}
                  </select>
                </div>
                <label style={{ fontSize: '0.85rem', color: 'var(--gray-light)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-condensed)', marginBottom: 16 }}>Палитра ({gtasaColors.length} цветов):</label>
                <div className="color-cube-grid">
                  {gtasaColors.map(color => (
                    <div
                      key={color.id}
                      className={`color-cube ${selectedColor.id === color.id ? 'active' : ''}`}
                      style={{ backgroundColor: hexToCss(color.hex) }}
                      onClick={() => setSelectedColor(color)}
                      title={`${color.name} (${color.hex})`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}