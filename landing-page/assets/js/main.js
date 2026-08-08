/* Photocopy Thùy Linh — landing page
 * Cấu hình form: điền endpoint vào FORM_CONFIG bên dưới để nối Google Apps Script / API thật.
 * Khi endpoint còn rỗng, form chạy ở chế độ demo và KHÔNG gửi dữ liệu đi đâu cả.
 */
const FAQ = [
  ["Tôi gửi bản viết tay thì bao lâu có bản đánh máy?",
   "Tùy số trang và chữ có dễ đọc không. Bạn gọi báo số trang, chúng tôi hẹn giờ trả cụ thể ngay lúc đó chứ không hẹn chung chung."],
  ["Có nhận file qua Zalo không hay phải mang tới tiệm?",
   "Có, bạn gửi file qua Zalo số 0382 968 318. Mang USB hoặc bản giấy tới tiệm cũng được."],
  ["Tiệm có nhận hồ sơ đấu thầu và hoàn công không?",
   "Có, đây là loại việc tiệm làm nhiều. Bạn gửi trước danh mục hồ sơ và số bộ cần in để chúng tôi xếp lịch máy, tránh làm sát hạn nộp."],
  ["Đánh máy xong tôi muốn sửa lại thì có mất thêm tiền không?",
   "Bạn xem bản nháp và sửa trước khi in, phần sửa này không tính thêm. Nếu đã in rồi mới đổi nội dung thì chỉ tính phần giấy in lại."],
  ["Photo giấy tờ tùy thân có bị giữ bản gốc không?",
   "Không. Bản gốc trả lại cùng lúc với bản photo, ngay tại quầy."],
  ["In số lượng lớn có giá khác không?",
   "Có. Số lượng càng nhiều thì đơn giá mỗi trang càng giảm. Bạn nói tổng số bản, chúng tôi báo mức cụ thể."],
  ["Tiệm có nhận đóng quyển luận văn không?",
   "Có, gồm in, đóng gáy và làm bìa. Nên gọi trước một hôm để chúng tôi chuẩn bị giấy và bìa đúng loại bạn cần."],
  ["Tôi ở xã khác, không tiện đi lại thì làm thế nào?",
   "Gọi trước để thống nhất nội dung và báo giá, chúng tôi làm sẵn để bạn tới là lấy được luôn, khỏi phải chờ."],
  ["Trang này có nhận thanh toán online không?",
   "Không. Trang này chỉ dùng để bạn xem dịch vụ và để lại thông tin. Việc thanh toán thực hiện trực tiếp tại tiệm."]
];

const FORM_CONFIG = { endpoint: "", method: "POST" };

document.addEventListener('DOMContentLoaded', function () {

    const root = document;
    const $ = s => root.querySelector(s);

    const y = $("#year"); if (y) y.textContent = new Date().getFullYear();

    // Mobile menu
    const toggle = $("#nav-toggle"), menu = $("#mobile-menu");
    if (toggle && menu) {
      menu.hidden = true;
      menu.style.display = "none";
      toggle.addEventListener("click", () => {
        const open = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!open));
        toggle.setAttribute("aria-label", open ? "Mở menu" : "Đóng menu");
        menu.hidden = open;
        menu.style.display = open ? "none" : "block";
      });
      menu.addEventListener("click", e => {
        if (e.target.closest("a")) {
          toggle.setAttribute("aria-expanded", "false");
          toggle.setAttribute("aria-label", "Mở menu");
          menu.hidden = true;
          menu.style.display = "none";
        }
      });
    }

    // FAQ accordion
    const faq = $("#faq");
    if (faq && !faq.childElementCount) {
      FAQ.forEach(([q, a], i) => {
        const item = document.createElement("div");
        item.style.cssText = "background:#fff;border:1px solid #E4DCCC;border-radius:14px;overflow:hidden";
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "faq-q";
        btn.id = "faq-q-" + i;
        btn.setAttribute("aria-expanded", "false");
        btn.setAttribute("aria-controls", "faq-a-" + i);
        btn.style.cssText = "width:100%;display:flex;gap:16px;align-items:center;justify-content:space-between;text-align:left;background:transparent;border:0;padding:20px 22px;font-weight:700;font-size:17px;color:#0F2233;cursor:pointer;transition:background .15s ease";
        btn.innerHTML = '<span>' + q + '</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F3652" stroke-width="2.4" stroke-linecap="round" aria-hidden="true" style="flex-shrink:0;transition:transform .2s ease"><path d="M6 9l6 6 6-6"/></svg>';
        const panel = document.createElement("div");
        panel.id = "faq-a-" + i;
        panel.setAttribute("role", "region");
        panel.setAttribute("aria-labelledby", "faq-q-" + i);
        panel.hidden = true;
        panel.style.cssText = "padding:0 22px 22px;color:#4E5C69;font-size:16px";
        panel.textContent = a;
        btn.addEventListener("click", () => {
          const open = btn.getAttribute("aria-expanded") === "true";
          faq.querySelectorAll(".faq-q").forEach(b => {
            b.setAttribute("aria-expanded", "false");
            b.querySelector("svg").style.transform = "rotate(0deg)";
            root.querySelector("#" + b.getAttribute("aria-controls")).hidden = true;
          });
          if (!open) {
            btn.setAttribute("aria-expanded", "true");
            btn.querySelector("svg").style.transform = "rotate(180deg)";
            panel.hidden = false;
          }
        });
        item.append(btn, panel);
        faq.appendChild(item);
      });
    }

    // Form
    const form = $("#lead-form");
    if (form) {
      const status = $("#form-status"), submit = $("#f-submit");
      let sending = false;
      const setErr = (id, msg) => {
        const p = root.querySelector("#err-" + id), input = root.querySelector("#f-" + id);
        p.textContent = msg || "";
        p.style.display = msg ? "block" : "none";
        input.setAttribute("aria-invalid", msg ? "true" : "false");
        input.style.borderColor = msg ? "#B23A17" : "#D8CFBE";
      };
      const say = (msg, ok) => {
        status.textContent = msg;
        status.style.display = "block";
        status.style.background = ok === false ? "#FCEDE7" : ok ? "#E8F3EC" : "#EDF1F5";
        status.style.color = ok === false ? "#8E2C10" : ok ? "#1E6B41" : "#3B4A57";
      };

      form.addEventListener("submit", async e => {
        e.preventDefault();
        if (sending) return;
        const name = $("#f-name").value.trim();
        const phone = $("#f-phone").value.trim();
        const note = $("#f-note").value.trim();
        let bad = false;
        setErr("name", ""); setErr("phone", ""); setErr("note", "");
        if (name.length < 2) { setErr("name", "Vui lòng nhập họ và tên."); bad = true; }
        if (!/^0\d{8,10}$/.test(phone.replace(/[\s.\-()]/g, ""))) { setErr("phone", "Số điện thoại chưa đúng định dạng."); bad = true; }
        if (note.length < 5) { setErr("note", "Mô tả ngắn gọn việc bạn cần làm."); bad = true; }
        if (bad) { say("Còn vài ô chưa hợp lệ, bạn kiểm tra lại giúp nhé.", false); return; }

        sending = true;
        submit.disabled = true;
        submit.style.opacity = ".65";
        submit.style.cursor = "wait";
        submit.textContent = "Đang gửi…";
        say("Đang gửi thông tin…");

        try {
          if (FORM_CONFIG.endpoint) {
            const res = await fetch(FORM_CONFIG.endpoint, {
              method: FORM_CONFIG.method,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name, phone, note, service: $("#f-service").value })
            });
            if (!res.ok) throw new Error("HTTP " + res.status);
            say("Đã gửi. Chúng tôi sẽ gọi lại cho bạn trong thời gian sớm nhất.", true);
            form.reset();
          } else {
            await new Promise(r => setTimeout(r, 700));
            say("Chế độ demo: thông tin CHƯA được gửi đi đâu cả vì trang chưa nối endpoint. Bạn vui lòng gọi 0382 968 318.", false);
          }
        } catch (err) {
          say("Gửi không thành công. Bạn gọi trực tiếp 0382 968 318 giúp chúng tôi nhé.", false);
        } finally {
          sending = false;
          submit.disabled = false;
          submit.style.opacity = "1";
          submit.style.cursor = "pointer";
          submit.textContent = "Gửi thông tin";
        }
      });
    }
});
