# My K-Drama List
 
## Demo
### Link
- [首頁](https://linyawun.github.io/My-K-Drama-List/)

### 影片
- [local server demo]()
  - local 端執行 json-server，可更動資料庫，功能包含註冊、更新密碼與加入最愛清單
- [Vercel server demo]()
  - Vercel 不能更新db.json，只能根據現有 db.json 呈現，功能較受限
 
## 相關資源
- [網站地圖](https://whimsical.com/AvxrPGndY3A3k55WpPFwvo)
- [Wireframe](https://whimsical.com/8yLgbAJ3MfCpZCAnXuDXHW)
- [設計稿](https://www.figma.com/file/9KJWTbcPojykWf5LrUce0a/%E9%9F%93%E5%8A%87%E8%92%90%E9%9B%86%E7%B6%B2?node-id=0%3A1)

## 使用套件
- [bootstrap 5](https://getbootstrap.com/docs/5.0/getting-started/introduction/)
- [bootstrap-select](https://developer.snapappointments.com/bootstrap-select/)
- [Swiper](https://swiperjs.com/)
- [axios](https://axios-http.com/)
- [sweetalert2](https://sweetalert2.github.io/)
- [validate.js](https://validatejs.org/)

## 說明
此為2022年參加六角學院 JavaScript 直播班的專題作品，由六角學院找設計師設計首頁版型與主視覺指引。
### 專題內涵
- html 與 CSS 切版：採用 Bootstrap 5 客製化
- API：以 json-server 自訂資料庫 db.json，將資料庫架在 Vercel
- JavaScript：API 串接，功能包含：
  - 顯示韓劇列表
  - 顯示文章列表
  - 依條件搜尋韓劇
  - 顯示韓劇詳細資訊
  - 會員登入
  - 會員登出
  - 會員註冊
  - 登入與註冊的表單驗證
  - 顯示會員資料
  - 會員更改密碼
  - 會員新增「最愛清單」/「待看清單」
  - 會員刪除「最愛清單」/「待看清單」
  - 顯示會員的「最愛清單」/「待看清單」
