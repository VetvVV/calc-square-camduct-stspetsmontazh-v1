(function(){
  const text={ru:"ru",uk:"uk",en:"en"};
  window.CALC_CAMDUCT_MAP={
    version:1,
    status:{
      ready:"ready",
      draft:"draft",
      needsSample:"needs-sample"
    },
    sourceNotes:[
      "89139.MAJ contains UTF-16 strings such as ./Fabrication/, DW144-LV, HVAC, RND-SegmentBend.png, RND-StraightSeamedPipe.png, RECT-Spigot.png, Taper, GALV and GALVANISED.",
      "Direct MAJ writing is postponed until several real CAMduct jobs are compared and field positions are mapped safely."
    ],
    materials:{
      galv:{camductCode:"GALV",camductName:"GALVANISED",names:{ru:"Оцинкованная сталь",uk:"Оцинкована сталь",en:"Galvanized steel"}},
      ss430:{camductCode:"SS430",camductName:"STAINLESS 430",names:{ru:"Нержавеющая 430 техническая",uk:"Нержавіюча 430 технічна",en:"Stainless 430"}},
      ss304:{camductCode:"SS304",camductName:"STAINLESS 304",names:{ru:"Нержавеющая 304 пищевая",uk:"Нержавіюча 304 харчова",en:"Stainless 304"}},
      aluminum:{camductCode:"ALUMINIUM",camductName:"ALUMINIUM",names:{ru:"Алюминий",uk:"Алюміній",en:"Aluminum"}}
    },
    families:{
      "round-duct":{
        status:"draft",
        camductFamily:"RND-StraightSeamedPipe",
        camductImage:"RND-StraightSeamedPipe.png",
        binaryParamOffsetsFromImage:{A:-952,B:-1004},
        folder:"./Fabrication/",
        standard:"DW144-LV",
        category:"HVAC",
        names:{ru:"Круглый канал",uk:"Круглий канал",en:"Straight seamed pipe"},
        params:[
          {camduct:"A", source:"D", meaning:{ru:"Диаметр",uk:"Діаметр",en:"Diameter"}},
          {camduct:"B", source:"L", meaning:{ru:"Длина",uk:"Довжина",en:"Length"}},
          {camduct:"C", source:"LeftExtension", fallback:0, meaning:{ru:"Левое удлинение",uk:"Ліве подовження",en:"Left extension"}},
          {camduct:"D", source:"RightExtension", fallback:0, meaning:{ru:"Правое удлинение",uk:"Праве подовження",en:"Right extension"}}
        ],
        options:[
          {camduct:"SeamPosition", source:"SeamPosition", fallback:90, meaning:{ru:"Расположение шва",uk:"Розташування шва",en:"Seam position"}},
          {camduct:"MaterialType", source:"MaterialType", fallback:"Номинальный", meaning:{ru:"Тип диаметра",uk:"Тип діаметра",en:"Diameter type"}}
        ],
        connectors:[
          {camduct:"C1", source:"C1", fallback:"Нет", meaning:{ru:"Соединитель C1",uk:"З'єднувач C1",en:"Connector C1"}},
          {camduct:"C2", source:"C2", fallback:"Нет", meaning:{ru:"Соединитель C2",uk:"З'єднувач C2",en:"Connector C2"}},
          {camduct:"S1", source:"S1", fallback:"12,5/12,5", meaning:{ru:"Продольный шов S1",uk:"Поздовжній шов S1",en:"Longitudinal seam S1"}},
          {camduct:"D1", source:"D1", fallback:"Нет", meaning:{ru:"Соединитель D1",uk:"З'єднувач D1",en:"Connector D1"}},
          {camduct:"D2", source:"D2", fallback:"Нет", meaning:{ru:"Соединитель D2",uk:"З'єднувач D2",en:"Connector D2"}}
        ]
      },
      "round-inset":{
        status:"draft",
        camductFamily:"RND-StraightSeamedPipe",
        camductImage:"RND-StraightSeamedPipe.png",
        folder:"./Fabrication/",
        standard:"DW144-LV",
        category:"HVAC",
        names:{ru:"Врезка",uk:"Врізка",en:"Round inset"},
        params:[
          {camduct:"B", source:"D", meaning:{ru:"Диаметр",uk:"Діаметр",en:"Diameter"}},
          {camduct:"L", source:"L", meaning:{ru:"Длина",uk:"Довжина",en:"Length"}}
        ],
        contextHints:["врезка"]
      },
      "round-elbow":{
        status:"draft",
        camductFamily:"RND-SegmentBend",
        camductImage:"RND-SegmentBend.png",
        quantityOffsetAfterImage:974,
        folder:"./Fabrication/",
        standard:"DW144-LV",
        category:"HVAC",
        names:{ru:"Отвод круглый",uk:"Відвід круглий",en:"Round segment bend"},
        params:[
          {camduct:"A", source:"D", meaning:{ru:"Диаметр",uk:"Діаметр",en:"Diameter"}},
          {camduct:"B", source:"R", meaning:{ru:"Внутренний радиус",uk:"Внутрішній радіус",en:"Inside radius"}},
          {camduct:"C", source:"Angle", fallback:90, meaning:{ru:"Угол",uk:"Кут",en:"Angle"}},
          {camduct:"D", source:"LowerExtension", meaning:{ru:"Нижнее удлинение",uk:"Нижнє подовження",en:"Lower extension"}},
          {camduct:"E", source:"UpperExtension", meaning:{ru:"Верхнее удлинение",uk:"Верхнє подовження",en:"Upper extension"}}
        ],
        options:[
          {camduct:"SegmentCount", source:"SegmentCount", fallback:3, meaning:{ru:"Число сегментов",uk:"Кількість сегментів",en:"Segment count"}},
          {camduct:"SeamPosition", source:"SeamPosition", fallback:"0,0", meaning:{ru:"Расположение шва",uk:"Розташування шва",en:"Seam position"}},
          {camduct:"CrossSection", source:"CrossSection", fallback:1, meaning:{ru:"Поперечный разрез",uk:"Поперечний розріз",en:"Cross section"}},
          {camduct:"SingleSegments", source:"SingleSegments", fallback:"Нет", meaning:{ru:"Единичные сегменты",uk:"Одиничні сегменти",en:"Single segments"}},
          {camduct:"MaterialType", source:"MaterialType", fallback:"Номинальный", meaning:{ru:"Тип диаметра",uk:"Тип діаметра",en:"Diameter type"}}
        ],
        connectors:[
          {camduct:"C1", source:"C1", fallback:"8/8", meaning:{ru:"Соединитель C1",uk:"З'єднувач C1",en:"Connector C1"}},
          {camduct:"S1", source:"S1", fallback:"точка0/3", meaning:{ru:"Соединитель/шов S1",uk:"З'єднувач/шов S1",en:"Connector/seam S1"}},
          {camduct:"D1", source:"D1", fallback:"Нет", meaning:{ru:"Соединитель D1",uk:"З'єднувач D1",en:"Connector D1"}},
          {camduct:"D2", source:"D2", fallback:"Нет", meaning:{ru:"Соединитель D2",uk:"З'єднувач D2",en:"Connector D2"}}
        ],
        sampleStrings:["отвод 90","отвод 45--","125","250","RND-SegmentBend.png"]
      },
      "round-transition":{
        status:"needs-sample",
        camductFamily:"Taper",
        camductImage:"",
        folder:"./Fabrication/",
        standard:"DW144-LV",
        category:"HVAC",
        names:{ru:"Переход",uk:"Перехід",en:"Taper"},
        params:[
          {camduct:"B", source:"D1", meaning:{ru:"Диаметр 1",uk:"Діаметр 1",en:"Diameter 1"}},
          {camduct:"C", source:"D2", meaning:{ru:"Диаметр 2",uk:"Діаметр 2",en:"Diameter 2"}},
          {camduct:"L", source:"L", meaning:{ru:"Длина",uk:"Довжина",en:"Length"}}
        ]
      },
      "rectangular-duct":{
        status:"needs-sample",
        camductFamily:"RECT-Spigot",
        camductImage:"RECT-Spigot.png",
        folder:"./Fabrication/",
        standard:"DW144-LV",
        category:"HVAC",
        names:{ru:"Канал",uk:"Канал",en:"Rectangular duct"},
        params:[
          {camduct:"A", source:"A", meaning:{ru:"Ширина",uk:"Ширина",en:"Width"}},
          {camduct:"B", source:"B", meaning:{ru:"Высота",uk:"Висота",en:"Height"}},
          {camduct:"L", source:"L", meaning:{ru:"Длина",uk:"Довжина",en:"Length"}}
        ]
      },
      "rectangular-elbow":{
        status:"needs-sample",
        camductFamily:"RECT-Radius Bend",
        camductImage:"RECT-Radius Bend.png",
        folder:"./Fabrication/",
        standard:"DW144-LV",
        category:"HVAC",
        names:{ru:"Отвод прямоугольный",uk:"Відвід прямокутний",en:"Rectangular radius bend"},
        params:[]
      },
      "rectangular-transition":{
        status:"draft",
        camductFamily:"RECT-Taper",
        camductImage:"RECT-Taper.png",
        folder:"./Fabrication/",
        standard:"DW144-LV",
        category:"HVAC",
        names:{ru:"Переход",uk:"Перехід",en:"Rectangular taper"},
        params:[
          {camduct:"A", source:"A", meaning:{ru:"Ширина 1",uk:"Ширина 1",en:"Width 1"}},
          {camduct:"B", source:"B", meaning:{ru:"Высота 1",uk:"Висота 1",en:"Height 1"}},
          {camduct:"C", source:"C", meaning:{ru:"Ширина 2",uk:"Ширина 2",en:"Width 2"}},
          {camduct:"D", source:"D", meaning:{ru:"Высота 2",uk:"Висота 2",en:"Height 2"}},
          {camduct:"L", source:"L", meaning:{ru:"Длина",uk:"Довжина",en:"Length"}}
        ]
      },
      "round-to-rectangular":{
        status:"draft",
        camductFamily:"RECT-SquaretoRoundOffset",
        camductImage:"RECT-SquaretoRoundOffset.png",
        folder:"./Fabrication/",
        standard:"DW144-LV",
        category:"HVAC",
        names:{ru:"Переход круг-прямоугольник",uk:"Перехід круг-прямокутник",en:"Square to round"},
        params:[
          {camduct:"A", source:"A", meaning:{ru:"Ширина",uk:"Ширина",en:"Width"}},
          {camduct:"B", source:"B", meaning:{ru:"Высота",uk:"Висота",en:"Height"}},
          {camduct:"D", source:"D", meaning:{ru:"Диаметр",uk:"Діаметр",en:"Diameter"}},
          {camduct:"L", source:"L", meaning:{ru:"Длина",uk:"Довжина",en:"Length"}}
        ]
      },
      "rectangular-grille-box":{
        status:"needs-sample",
        camductFamily:"RECT-GrilleBoxCross",
        camductImage:"RECT-GrilleBoxCross.png",
        folder:"./Fabrication/",
        standard:"DW144-LV",
        category:"HVAC",
        names:{ru:"Камера/врезка решетки",uk:"Камера/врізка решітки",en:"Grille box"},
        params:[]
      }
    },
    knownMajTokens:[
      "./Fabrication/",
      "DW144-LV",
      "HVAC",
      "Burny",
      "GALV",
      "GALVANISED",
      "RND-SegmentBend.png",
      "RND-StraightSeamedPipe.png",
      "RECT-Spigot.png",
      "RECT-Radius Bend.png",
      "RECT-Taper.png",
      "RECT-SquaretoRoundOffset.png",
      "RECT-GrilleBoxCross.png",
      "Taper",
      "90 Radius Bend",
      "Spigot",
      "Spiral Tube",
      "Square Tee",
      "Воздуховод",
      "Канал",
      "Переход",
      "отвод 90"
    ],
    pickText(map,lang){
      const key=text[lang]||"ru";
      return map?.[key]||map?.ru||map?.uk||map?.en||"";
    }
  };
})();
