/* ============================================================
   ADDRESS-UTILS.JS
   - Danh sach quoc tich (195 quoc gia)
   - API tinh / xa (2 cap, 34 tinh theo quy dinh moi)
     API: https://provinces.open-api.vn/api/
          Province -> depth=3 -> flatten wards (bo qua huyen)
   ============================================================ */

/* ----------------------------------------------------------------
   1. DANH SACH QUOC TICH
   ---------------------------------------------------------------- */
const NATIONALITIES = [
  { code: "vn", flag: "VN", name: "Viet Nam" },
  { code: "af", flag: "AF", name: "Afghanistan" },
  { code: "al", flag: "AL", name: "Albania" },
  { code: "dz", flag: "DZ", name: "Algeria" },
  { code: "ad", flag: "AD", name: "Andorra" },
  { code: "ao", flag: "AO", name: "Angola" },
  { code: "ag", flag: "AG", name: "Antigua va Barbuda" },
  { code: "ar", flag: "AR", name: "Argentina" },
  { code: "am", flag: "AM", name: "Armenia" },
  { code: "au", flag: "AU", name: "Australia" },
  { code: "at", flag: "AT", name: "Ao" },
  { code: "az", flag: "AZ", name: "Azerbaijan" },
  { code: "bs", flag: "BS", name: "Bahamas" },
  { code: "bh", flag: "BH", name: "Bahrain" },
  { code: "bd", flag: "BD", name: "Bangladesh" },
  { code: "bb", flag: "BB", name: "Barbados" },
  { code: "by", flag: "BY", name: "Belarus" },
  { code: "be", flag: "BE", name: "Bi" },
  { code: "bz", flag: "BZ", name: "Belize" },
  { code: "bj", flag: "BJ", name: "Benin" },
  { code: "bt", flag: "BT", name: "Bhutan" },
  { code: "bo", flag: "BO", name: "Bolivia" },
  { code: "ba", flag: "BA", name: "Bosnia va Herzegovina" },
  { code: "bw", flag: "BW", name: "Botswana" },
  { code: "br", flag: "BR", name: "Brazil" },
  { code: "bn", flag: "BN", name: "Brunei" },
  { code: "bg", flag: "BG", name: "Bulgaria" },
  { code: "bf", flag: "BF", name: "Burkina Faso" },
  { code: "bi", flag: "BI", name: "Burundi" },
  { code: "cv", flag: "CV", name: "Cape Verde" },
  { code: "kh", flag: "KH", name: "Campuchia" },
  { code: "cm", flag: "CM", name: "Cameroon" },
  { code: "ca", flag: "CA", name: "Canada" },
  { code: "cf", flag: "CF", name: "Cong hoa Trung Phi" },
  { code: "td", flag: "TD", name: "Chad" },
  { code: "cl", flag: "CL", name: "Chile" },
  { code: "cn", flag: "CN", name: "Trung Quoc" },
  { code: "co", flag: "CO", name: "Colombia" },
  { code: "km", flag: "KM", name: "Comoros" },
  { code: "cg", flag: "CG", name: "Congo" },
  { code: "cr", flag: "CR", name: "Costa Rica" },
  { code: "hr", flag: "HR", name: "Croatia" },
  { code: "cu", flag: "CU", name: "Cuba" },
  { code: "cy", flag: "CY", name: "Cyprus" },
  { code: "cz", flag: "CZ", name: "Sec" },
  { code: "dk", flag: "DK", name: "Dan Mach" },
  { code: "dj", flag: "DJ", name: "Djibouti" },
  { code: "dm", flag: "DM", name: "Dominica" },
  { code: "do", flag: "DO", name: "Cong hoa Dominican" },
  { code: "ec", flag: "EC", name: "Ecuador" },
  { code: "eg", flag: "EG", name: "Ai Cap" },
  { code: "sv", flag: "SV", name: "El Salvador" },
  { code: "gq", flag: "GQ", name: "Guinea Xich Dao" },
  { code: "er", flag: "ER", name: "Eritrea" },
  { code: "ee", flag: "EE", name: "Estonia" },
  { code: "sz", flag: "SZ", name: "Eswatini" },
  { code: "et", flag: "ET", name: "Ethiopia" },
  { code: "fj", flag: "FJ", name: "Fiji" },
  { code: "fi", flag: "FI", name: "Phan Lan" },
  { code: "fr", flag: "FR", name: "Phap" },
  { code: "ga", flag: "GA", name: "Gabon" },
  { code: "gm", flag: "GM", name: "Gambia" },
  { code: "ge", flag: "GE", name: "Georgia" },
  { code: "de", flag: "DE", name: "Duc" },
  { code: "gh", flag: "GH", name: "Ghana" },
  { code: "gr", flag: "GR", name: "Hy Lap" },
  { code: "gd", flag: "GD", name: "Grenada" },
  { code: "gt", flag: "GT", name: "Guatemala" },
  { code: "gn", flag: "GN", name: "Guinea" },
  { code: "gw", flag: "GW", name: "Guinea-Bissau" },
  { code: "gy", flag: "GY", name: "Guyana" },
  { code: "ht", flag: "HT", name: "Haiti" },
  { code: "hn", flag: "HN", name: "Honduras" },
  { code: "hu", flag: "HU", name: "Hungary" },
  { code: "is", flag: "IS", name: "Iceland" },
  { code: "in", flag: "IN", name: "An Do" },
  { code: "id", flag: "ID", name: "Indonesia" },
  { code: "ir", flag: "IR", name: "Iran" },
  { code: "iq", flag: "IQ", name: "Iraq" },
  { code: "ie", flag: "IE", name: "Ireland" },
  { code: "il", flag: "IL", name: "Israel" },
  { code: "it", flag: "IT", name: "Y" },
  { code: "jm", flag: "JM", name: "Jamaica" },
  { code: "jp", flag: "JP", name: "Nhat Ban" },
  { code: "jo", flag: "JO", name: "Jordan" },
  { code: "kz", flag: "KZ", name: "Kazakhstan" },
  { code: "ke", flag: "KE", name: "Kenya" },
  { code: "ki", flag: "KI", name: "Kiribati" },
  { code: "kp", flag: "KP", name: "Trieu Tien" },
  { code: "kr", flag: "KR", name: "Han Quoc" },
  { code: "kw", flag: "KW", name: "Kuwait" },
  { code: "kg", flag: "KG", name: "Kyrgyzstan" },
  { code: "la", flag: "LA", name: "Lao" },
  { code: "lv", flag: "LV", name: "Latvia" },
  { code: "lb", flag: "LB", name: "Li Bang" },
  { code: "ls", flag: "LS", name: "Lesotho" },
  { code: "lr", flag: "LR", name: "Liberia" },
  { code: "ly", flag: "LY", name: "Libya" },
  { code: "li", flag: "LI", name: "Liechtenstein" },
  { code: "lt", flag: "LT", name: "Lithuania" },
  { code: "lu", flag: "LU", name: "Luxembourg" },
  { code: "mg", flag: "MG", name: "Madagascar" },
  { code: "mw", flag: "MW", name: "Malawi" },
  { code: "my", flag: "MY", name: "Malaysia" },
  { code: "mv", flag: "MV", name: "Maldives" },
  { code: "ml", flag: "ML", name: "Mali" },
  { code: "mt", flag: "MT", name: "Malta" },
  { code: "mh", flag: "MH", name: "Marshall Islands" },
  { code: "mr", flag: "MR", name: "Mauritania" },
  { code: "mu", flag: "MU", name: "Mauritius" },
  { code: "mx", flag: "MX", name: "Mexico" },
  { code: "fm", flag: "FM", name: "Micronesia" },
  { code: "md", flag: "MD", name: "Moldova" },
  { code: "mc", flag: "MC", name: "Monaco" },
  { code: "mn", flag: "MN", name: "Mong Co" },
  { code: "me", flag: "ME", name: "Montenegro" },
  { code: "ma", flag: "MA", name: "Maroc" },
  { code: "mz", flag: "MZ", name: "Mozambique" },
  { code: "mm", flag: "MM", name: "Myanmar" },
  { code: "na", flag: "NA", name: "Namibia" },
  { code: "nr", flag: "NR", name: "Nauru" },
  { code: "np", flag: "NP", name: "Nepal" },
  { code: "nl", flag: "NL", name: "Ha Lan" },
  { code: "nz", flag: "NZ", name: "New Zealand" },
  { code: "ni", flag: "NI", name: "Nicaragua" },
  { code: "ne", flag: "NE", name: "Niger" },
  { code: "ng", flag: "NG", name: "Nigeria" },
  { code: "mk", flag: "MK", name: "Bac Macedonia" },
  { code: "no", flag: "NO", name: "Na Uy" },
  { code: "om", flag: "OM", name: "Oman" },
  { code: "pk", flag: "PK", name: "Pakistan" },
  { code: "pw", flag: "PW", name: "Palau" },
  { code: "pa", flag: "PA", name: "Panama" },
  { code: "pg", flag: "PG", name: "Papua New Guinea" },
  { code: "py", flag: "PY", name: "Paraguay" },
  { code: "pe", flag: "PE", name: "Peru" },
  { code: "ph", flag: "PH", name: "Philippines" },
  { code: "pl", flag: "PL", name: "Ba Lan" },
  { code: "pt", flag: "PT", name: "Bo Dao Nha" },
  { code: "qa", flag: "QA", name: "Qatar" },
  { code: "ro", flag: "RO", name: "Romania" },
  { code: "ru", flag: "RU", name: "Nga" },
  { code: "rw", flag: "RW", name: "Rwanda" },
  { code: "kn", flag: "KN", name: "Saint Kitts va Nevis" },
  { code: "lc", flag: "LC", name: "Saint Lucia" },
  { code: "vc", flag: "VC", name: "Saint Vincent va Grenadines" },
  { code: "ws", flag: "WS", name: "Samoa" },
  { code: "sm", flag: "SM", name: "San Marino" },
  { code: "st", flag: "ST", name: "Sao Tome va Principe" },
  { code: "sa", flag: "SA", name: "Saudi Arabia" },
  { code: "sn", flag: "SN", name: "Senegal" },
  { code: "rs", flag: "RS", name: "Serbia" },
  { code: "sc", flag: "SC", name: "Seychelles" },
  { code: "sl", flag: "SL", name: "Sierra Leone" },
  { code: "sg", flag: "SG", name: "Singapore" },
  { code: "sk", flag: "SK", name: "Slovakia" },
  { code: "si", flag: "SI", name: "Slovenia" },
  { code: "sb", flag: "SB", name: "Solomon Islands" },
  { code: "so", flag: "SO", name: "Somalia" },
  { code: "za", flag: "ZA", name: "Nam Phi" },
  { code: "ss", flag: "SS", name: "Nam Sudan" },
  { code: "es", flag: "ES", name: "Tay Ban Nha" },
  { code: "lk", flag: "LK", name: "Sri Lanka" },
  { code: "sd", flag: "SD", name: "Sudan" },
  { code: "sr", flag: "SR", name: "Suriname" },
  { code: "se", flag: "SE", name: "Thuy Dien" },
  { code: "ch", flag: "CH", name: "Thuy Si" },
  { code: "sy", flag: "SY", name: "Syria" },
  { code: "tw", flag: "TW", name: "Dai Loan" },
  { code: "tj", flag: "TJ", name: "Tajikistan" },
  { code: "tz", flag: "TZ", name: "Tanzania" },
  { code: "th", flag: "TH", name: "Thai Lan" },
  { code: "tl", flag: "TL", name: "Timor-Leste" },
  { code: "tg", flag: "TG", name: "Togo" },
  { code: "to", flag: "TO", name: "Tonga" },
  { code: "tt", flag: "TT", name: "Trinidad va Tobago" },
  { code: "tn", flag: "TN", name: "Tunisia" },
  { code: "tr", flag: "TR", name: "Tho Nhi Ky" },
  { code: "tm", flag: "TM", name: "Turkmenistan" },
  { code: "tv", flag: "TV", name: "Tuvalu" },
  { code: "ug", flag: "UG", name: "Uganda" },
  { code: "ua", flag: "UA", name: "Ukraine" },
  { code: "ae", flag: "AE", name: "UAE" },
  { code: "gb", flag: "GB", name: "Anh" },
  { code: "us", flag: "US", name: "My" },
  { code: "uy", flag: "UY", name: "Uruguay" },
  { code: "uz", flag: "UZ", name: "Uzbekistan" },
  { code: "vu", flag: "VU", name: "Vanuatu" },
  { code: "ve", flag: "VE", name: "Venezuela" },
  { code: "ye", flag: "YE", name: "Yemen" },
  { code: "zm", flag: "ZM", name: "Zambia" },
  { code: "zw", flag: "ZW", name: "Zimbabwe" }
];

/* ----------------------------------------------------------------
   2. 34 TINH/THANH PHO THEO QUY DINH MOI (hieu luc 1/7/2025)
   Nguon: Nghi quyet 60/2025/QH15
   ---------------------------------------------------------------- */
const PROVINCES_34 = [
  { code: "HAN", name: "Ha Noi" },
  { code: "HCM", name: "Ho Chi Minh" },
  { code: "HPH", name: "Hai Phong" },
  { code: "DAN", name: "Da Nang" },
  { code: "CTH", name: "Can Tho" },
  { code: "QNI", name: "Quang Ninh" },
  { code: "BNH", name: "Binh Dinh" },
  { code: "HGI", name: "Ha Giang" },
  { code: "TVH", name: "Tuyen Quang" },
  { code: "PTO", name: "Phu Tho" },
  { code: "NGE", name: "Nghe An" },
  { code: "QTI", name: "Quang Tri" },
  { code: "HAN2", name: "Hue" },
  { code: "GLA", name: "Gia Lai" },
  { code: "DAK", name: "Dak Lak" },
  { code: "LDO", name: "Lam Dong" },
  { code: "BDG", name: "Binh Duong" },
  { code: "DNA", name: "Dong Nai" },
  { code: "VTA", name: "Vung Tau" },
  { code: "LAN", name: "Long An" },
  { code: "TGI", name: "Tien Giang" },
  { code: "VLG", name: "Vinh Long" },
  { code: "HGI2", name: "Hau Giang" },
  { code: "KGI", name: "Kien Giang" },
  { code: "CMU", name: "Ca Mau" },
  { code: "LCI", name: "Lao Cai" },
  { code: "SLA", name: "Son La" },
  { code: "TBH", name: "Thanh Hoa" },
  { code: "HNA", name: "Ha Nam" },
  { code: "NBH", name: "Ninh Binh" },
  { code: "TNN", name: "Thai Nguyen" },
  { code: "QNH", name: "Quang Nam" },
  { code: "BTO", name: "Binh Thuan" },
  { code: "AGI", name: "An Giang" }
];

/* ----------------------------------------------------------------
   3. POPULATE NATIONALITY SELECT
   ---------------------------------------------------------------- */
function populateNationality(selectId, selectedCode = "vn") {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  sel.innerHTML = '<option value="">-- Chon quoc tich --</option>';
  NATIONALITIES.forEach(n => {
    const flag = getFlagEmoji(n.flag);
    const opt = document.createElement("option");
    opt.value = n.code;
    opt.textContent = flag + " " + n.name;
    if (n.code === selectedCode) opt.selected = true;
    sel.appendChild(opt);
  });
}

function getFlagEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return "";
  return String.fromCodePoint(...[...countryCode.toUpperCase()].map(c => 127397 + c.charCodeAt(0)));
}

/* ----------------------------------------------------------------
   4. API TINH / XA (2 cap, bo qua huyen)
   Endpoint: https://provinces.open-api.vn/api/
   - Lay danh sach tinh
   - Khi chon tinh: lay depth=3 -> flatten tat ca phuong/xa
   ---------------------------------------------------------------- */
const PROVINCE_API = "https://provinces.open-api.vn/api";

/**
 * Load 34 tinh/thanh pho vao select
 * @param {string} provinceSelectId  - ID cua <select> tinh
 * @param {string} communeSelectId   - ID cua <select> xa/phuong
 * @param {number|null} selectedCode - Ma tinh muon chon san
 */
async function loadProvinces(provinceSelectId, communeSelectId, selectedCode = null) {
  const sel = document.getElementById(provinceSelectId);
  if (!sel) return;

  sel.innerHTML = '<option value="">-- Dang tai... --</option>';
  sel.disabled = true;
  resetSelect(communeSelectId, "-- Chon Phuong / Xa --", true);

  try {
    const res = await fetch(PROVINCE_API + "/");
    const data = await res.json();

    sel.innerHTML = '<option value="">-- Chon Tinh / Thanh pho --</option>';
    data
      .sort((a, b) => a.name.localeCompare(b.name, "vi"))
      .forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.code;
        opt.textContent = p.name;
        if (selectedCode && p.code == selectedCode) opt.selected = true;
        sel.appendChild(opt);
      });
    sel.disabled = false;

    // Rang buoc su kien
    sel.onchange = function () {
      if (this.value) {
        loadCommunes(this.value, communeSelectId);
      } else {
        resetSelect(communeSelectId, "-- Chon Phuong / Xa --", true);
      }
    };

    // Neu co san gia tri chon truoc
    if (selectedCode) {
      await loadCommunes(selectedCode, communeSelectId);
    }
  } catch (e) {
    console.warn("[address-utils] Khong goi duoc API tinh, su dung danh sach 34 tinh thanh du phong:", e);
    sel.innerHTML = '<option value="">-- Chon Tinh / Thanh pho --</option>';
    PROVINCES_34.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.code;
      opt.textContent = p.name;
      if (selectedCode && p.code == selectedCode) opt.selected = true;
      sel.appendChild(opt);
    });
    sel.disabled = false;

    sel.onchange = function () {
      if (this.value) {
        loadCommunes(this.value, communeSelectId);
      } else {
        resetSelect(communeSelectId, "-- Chon Phuong / Xa --", true);
      }
    };
  }
}

/**
 * Load phuong/xa truc tiep theo ma tinh (bo qua cap huyen)
 * Dung depth=3 -> flatten wards tu tat ca districts
 * @param {number|string} provinceCode
 * @param {string} communeSelectId
 * @param {number|null} selectedCode - Ma xa muon chon san
 */
async function loadCommunes(provinceCode, communeSelectId, selectedCode = null) {
  const sel = document.getElementById(communeSelectId);
  if (!sel) return;

  sel.innerHTML = '<option value="">-- Dang tai... --</option>';
  sel.disabled = true;

  try {
    // depth=3: province -> districts -> wards
    const res = await fetch(PROVINCE_API + "/p/" + provinceCode + "?depth=3");
    const data = await res.json();

    // Flatten: lay tat ca wards tu moi district, bo qua cap district
    const allWards = [];
    (data.districts || []).forEach(d => {
      (d.wards || []).forEach(w => {
        allWards.push({ code: w.code, name: w.name });
      });
    });

    // Sap xep theo ten
    allWards.sort((a, b) => a.name.localeCompare(b.name, "vi"));

    sel.innerHTML = '<option value="">-- Chon Phuong / Xa --</option>';
    allWards.forEach(w => {
      const opt = document.createElement("option");
      opt.value = w.code;
      opt.textContent = w.name;
      if (selectedCode && w.code == selectedCode) opt.selected = true;
      sel.appendChild(opt);
    });
    sel.disabled = false;
  } catch (e) {
    console.warn("[address-utils] Khong goi duoc API xa, su dung danh sach mau:", e);
    const sampleWards = [
      "Phuong Ben Nghe", "Phuong Ben Thanh", "Phuong Da Kao", "Phuong Tan Dinh",
      "Phuong Hang Trong", "Phuong Trang Tien", "Phuong Phan Chu Trinh",
      "Xa Muong Hoa", "Xa Ta Van", "Xa Ban Ho", "Xa Pu Luong", "Xa Ban Lac"
    ];
    sel.innerHTML = '<option value="">-- Chon Phuong / Xa --</option>';
    sampleWards.forEach((w, idx) => {
      const opt = document.createElement("option");
      opt.value = "w_" + idx;
      opt.textContent = w;
      sel.appendChild(opt);
    });
    sel.disabled = false;
  }
}

/**
 * Reset select ve mac dinh
 */
function resetSelect(selectId, placeholder = "-- Chon --", disabled = false) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  sel.innerHTML = '<option value="">' + placeholder + '</option>';
  sel.disabled = disabled;
}

/* ----------------------------------------------------------------
   5. DANH SACH MA VUNG DIEN THOAI QUOC TE (INTERNATIONAL DIAL CODES)
   ---------------------------------------------------------------- */
const COUNTRY_DIAL_CODES = {
  vn: "+84", us: "+1", ca: "+1", gb: "+44", au: "+61", jp: "+81", kr: "+82",
  cn: "+86", tw: "+886", fr: "+33", de: "+49", ru: "+7", sg: "+65", th: "+66",
  my: "+60", id: "+62", ph: "+63", la: "+856", kh: "+855", mm: "+95", in: "+91",
  it: "+39", es: "+34", nl: "+31", ch: "+41", se: "+46", no: "+47", dk: "+45",
  fi: "+358", pl: "+48", br: "+55", mx: "+52", nz: "+64", za: "+27", ae: "+971",
  sa: "+966", tr: "+90", eg: "+20", il: "+972", pk: "+92", bd: "+880", at: "+43",
  be: "+32", cz: "+420", gr: "+30", hu: "+36", ie: "+353", pt: "+351", ro: "+40",
  ua: "+380", ar: "+54", cl: "+56", co: "+57", pe: "+51", np: "+977", lk: "+94"
};

function getDialCode(countryCode) {
  return COUNTRY_DIAL_CODES[countryCode?.toLowerCase()] || "+84";
}

function populateDialCodes(selectId, defaultCode = "vn") {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  sel.innerHTML = "";

  const priorityCodes = ["vn", "us", "jp", "kr", "cn", "tw", "gb", "au", "fr", "de", "sg", "th", "la", "kh", "my", "id", "ph", "ca", "ru", "in"];
  const added = new Set();

  priorityCodes.forEach(code => {
    const item = NATIONALITIES.find(n => n.code === code);
    const dial = COUNTRY_DIAL_CODES[code];
    if (item && dial) {
      const opt = document.createElement("option");
      opt.value = dial;
      opt.setAttribute("data-country", code);
      opt.textContent = getFlagEmoji(item.flag) + " " + dial;
      opt.title = item.name + " (" + dial + ")";
      if (code === defaultCode) opt.selected = true;
      sel.appendChild(opt);
      added.add(code);
    }
  });

  const sep = document.createElement("option");
  sep.disabled = true;
  sep.textContent = "──────────";
  sel.appendChild(sep);

  NATIONALITIES.forEach(n => {
    if (!added.has(n.code)) {
      const dial = COUNTRY_DIAL_CODES[n.code] || "+";
      const opt = document.createElement("option");
      opt.value = dial;
      opt.setAttribute("data-country", n.code);
      opt.textContent = getFlagEmoji(n.flag) + " " + dial;
      opt.title = n.name + " (" + dial + ")";
      sel.appendChild(opt);
    }
  });
}
