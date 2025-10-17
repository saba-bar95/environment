function cleanId(id, fallback = "untitled", index = 0) {
  if (!id) return `${fallback}-${index}`;
  return id
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

const rawCharts = {
  other: [
    {
      title_ge: "პესტიციდების ჯამური მოხმარების დინამიკა",
      title_en: "Dynamics of Total Pesticide Consumption",
      path_ge: "სხვა გარემოსდაცვითი თემები",
      path_en: "other environmental topics",
    },
    {
      title_ge: "პესტიციდების ინტენსივობა",
      title_en: "Pesticide Intensity",
      path_ge: "სხვა გარემოსდაცვითი თემები",
      path_en: "other environmental topics",
    },
    {
      title_ge: "პესტიციდების მოხმარება ტიპების მიხედვით (ტონა)",
      title_en: "Pesticide Consumption by Type (tons)",
      path_ge: "სხვა გარემოსდაცვითი თემები",
      path_en: "other environmental topics",
    },
    {
      title_ge: "მინერალური და ორგანული სასუქების გამოყენება",
      title_en: "Use of Mineral and Organic Fertilizers",
      path_ge: "სხვა გარემოსდაცვითი თემები",
      path_en: "other environmental topics",
    },
    {
      title_ge: "სასუქების ჯამური ინტენსივობა",
      title_en: "Total Fertilizer Intensity",
      path_ge: "სხვა გარემოსდაცვითი თემები",
      path_en: "other environmental topics",
    },
    {
      title_ge: "დამუშავებული სასოფლო-სამეურნეო ფართობი",
      title_en: "Cultivated agricultural area",
      path_ge: "სხვა გარემოსდაცვითი თემები",
      path_en: "other environmental topics",
    },
  ],
  waste: [
    {
      title_ge: "ნაგავსაყრელზე ჯამურად განთავსებული მუნიციპალური ნარჩენები",
      title_en: "Total Municipal Waste Disposed Of in Landfills",
      path_ge: "მუნიციპალური ნარჩენები",
      path_en: "municipal waste",
    },
    {
      title_ge: "მუნიციპალური ნარჩენები ერთ სულ მოსახლეზე",
      title_en: "Municipal waste per capita",
      path_ge: "მუნიციპალური ნარჩენები",
      path_en: "municipal waste",
    },
    {
      title_ge: "ნარჩენების წარმოქმნა მოსახლეობასთან მიმართებით",
      title_en: "Waste generation in relation to population",
      path_ge: "მუნიციპალური ნარჩენები",
      path_en: "municipal waste",
    },
    {
      title_ge: "ნარჩენების ჯამური რაოდენობის წლიური ზრდა",
      title_en: "Annual growth in total waste",
      path_ge: "მუნიციპალური ნარჩენები",
      path_en: "municipal waste",
    },
    {
      title_ge: "ნარჩენების ინტენსივობა ერთ სულ მოსახლეზე",
      title_en: "Waste intensity per capita",
      path_ge: "მუნიციპალური ნარჩენები",
      path_en: "municipal waste",
    },
    {
      title_ge: "მუნიციპალური მყარი ნარჩენების საილუსტრაციო შემადგენლობა",
      title_en: "Illustrative composition of municipal solid waste",
      path_ge: "მუნიციპალური ნარჩენები",
      path_en: "municipal waste",
    },
  ],
  transport: [
    {
      title_ge: "სამგზავრო გადაყვანების მოცულობა",
      title_en: "Passenger Capacity",
      path_ge: "ტრანსპორტის სტატისტიკა",
      path_en: "transport statistics",
    },
    {
      title_ge: "სატვირთო გადაზიდვების მოცულობა",
      title_en: "Freight Transportation Volume",
      path_ge: "ტრანსპორტის სტატისტიკა",
      path_en: "transport statistics",
    },
    {
      title_ge: "სამგზავრო გადაყვანები ტრანსპორტის სახეების მიხედვით",
      title_en: "Passenger Transfers by Type of Transport",
      path_ge: "ტრანსპორტის სტატისტიკა",
      path_en: "transport statistics",
    },
    {
      title_ge: "სატვირთო გადაზიდვები ტრანსპორტის სახეების მიხედვით",
      title_en: "Freight Transfers by Type of Transport",
      path_ge: "ტრანსპორტის სტატისტიკა",
      path_en: "transport statistics",
    },
    {
      title_ge: "სამგზავრო გადაყვანების განაწილება",
      title_en: "Distribution of Passenger Transfers",
      path_ge: "ტრანსპორტის სტატისტიკა",
      path_en: "transport statistics",
    },
    {
      title_ge: "სატვირთო გადაზიდვების განაწილება",
      title_en: "Distribution of Freight Transfers",
      path_ge: "ტრანსპორტის სტატისტიკა",
      path_en: "transport statistics",
    },
    {
      title_ge: "სატვირთო გადაზიდვების ინტენსივობა მშპ-სთან მიმართებით",
      title_en: "Freight transport intensity in relation to GDP",
      path_ge: "ტრანსპორტის სტატისტიკა",
      path_en: "transport statistics",
    },
    {
      title_ge: "სამგზავრო გადაყვანებზე მოთხოვნა ერთ სულ მოსახლეზე",
      title_en: "Per Capita Demand for Passenger Transport",
      path_ge: "ტრანსპორტის სტატისტიკა",
      path_en: "transport statistics",
    },
    {
      title_ge: "საავტომობილო ტრანსპორტი: სამგზავრო და სატვირთოს შედარება",
      title_en: "Road transport: comparison of passenger and freight transport",
      path_ge: "ტრანსპორტის სტატისტიკა",
      path_en: "transport statistics",
    },
    {
      title_ge: "სარკინიგზო ტრანსპორტი: სამგზავრო და სატვირთოს შედარება",
      title_en: "Rail transport: passenger and freight comparison",
      path_ge: "ტრანსპორტის სტატისტიკა",
      path_en: "transport statistics",
    },
  ],
  energy: [
    {
      title_ge: "ენერგიის საბოლოო მოხმარების ზრდა სექტორების მიხედვით",
      title_en: "Final Energy Consumption Growth by Sectors",
      path_ge: "საქართველოს ენერგეტიკის გარემოსდაცვითი მაჩვენებლები",
      path_en: "environmental performance of georgian energy sector",
    },
    {
      title_ge: "ენერგიის საბოლოო მოხმარების სტრუქტურა",
      title_en: "Structure of Final Energy Consumption",
      path_ge: "საქართველოს ენერგეტიკის გარემოსდაცვითი მაჩვენებლები",
      path_en: "environmental performance of georgian energy sector",
    },
    {
      title_ge: "სექტორების წილი ენერგიის საბოლოო მოხმარებაში (%)",
      title_en: "Share of Sectors in Final Energy Consumption",
      path_ge: "საქართველოს ენერგეტიკის გარემოსდაცვითი მაჩვენებლები",
      path_en: "environmental performance of georgian energy sector",
    },
    {
      title_ge: "პირველადი ენერგომომარაგების შემადგენლობა",
      title_en: "Composition of Primary Energy Supply",
      path_ge: "საქართველოს ენერგეტიკის გარემოსდაცვითი მაჩვენებლები",
      path_en: "environmental performance of georgian energy sector",
    },
    {
      title_ge: "ენერგიის წარმოება vs. ვაჭრობა",
      title_en: "Energy Production vs. Trade",
      path_ge: "საქართველოს ენერგეტიკის გარემოსდაცვითი მაჩვენებლები",
      path_en: "environmental performance of georgian energy sector",
    },
    {
      title_ge: "ენერგოინტენსივობა მშპ-სთან მიმართებით",
      title_en: "Energy Intensity in Relation to GDP",
      path_ge: "საქართველოს ენერგეტიკის გარემოსდაცვითი მაჩვენებლები",
      path_en: "environmental performance of georgian energy sector",
    },
    {
      title_ge: "ენერგოინტენსივობის წლიური ცვლილება",
      title_en: "Annual Change in Energy Intensity",
      path_ge: "საქართველოს ენერგეტიკის გარემოსდაცვითი მაჩვენებლები",
      path_en: "environmental performance of georgian energy sector",
    },
    {
      title_ge: "განახლებადი ენერგიის მიწოდების ზრდა ტიპების მიხედვით",
      title_en: "Renewable Energy Supply Growth by Type",
      path_ge: "საქართველოს ენერგეტიკის გარემოსდაცვითი მაჩვენებლები",
      path_en: "environmental performance of georgian energy sector",
    },
    {
      title_ge: "განახლებადი ენერგიის სტრუქტურა",
      title_en: "Renewable Energy Structure",
      path_ge: "საქართველოს ენერგეტიკის გარემოსდაცვითი მაჩვენებლები",
      path_en: "environmental performance of georgian energy sector",
    },
    {
      title_ge: "განახლებადი ენერგიის წილი მთლიან ენერგომომარაგებაში",
      title_en: "Share of Renewable Energy in Total Energy Supply",
      path_ge: "საქართველოს ენერგეტიკის გარემოსდაცვითი მაჩვენებლები",
      path_en: "environmental performance of georgian energy sector",
    },
  ],
  air: [
    {
      title_ge:
        "სტაციონარული წყაროებიდან მავნე ნივთიერებების დაჭერა და გაფრქვევა რეგიონების მიხედვით",
      title_en:
        "Capture and emission of stationary sources of financial resources by regions",
      path_ge: "ჰაერის ხარისხი და გაფრქვევები",
      path_en: "air quality and emissions",
    },
    {
      title_ge:
        "სტაციონარული წყაროებიდან მავნე ნივთიერებების დაჭერა და გაფრქვევა ქალაქების მიხედვით",
      title_en:
        "Capture and emission of stationary sources of financial resources by cities",
      path_ge: "ჰაერის ხარისხი და გაფრქვევები",
      path_en: "air quality and emissions",
    },
    {
      title_ge:
        "მავნე ნივთიერებების გაფრქვევა: სტაციონარული და მობილური წყაროები",
      title_en: "Security Council Dispersion: Stationary and Mobile Sources",
      path_ge: "ჰაერის ხარისხი და გაფრქვევები",
      path_en: "air quality and emissions",
    },
  ],
  reports: [
    {
      title_ge: "შიდა მატერიალური მოხმარება და მშპ ",
      title_en: "Domestic Material Consumption and GDP",
      path_ge: "მატერიალური ნაკადის ანგარიშები",
      path_en: "Material Flow Accounts",
    },
    {
      title_ge: "რესურსების პროდუქტიულობა და მატერიალური ინტენსივობა",
      title_en: "Resource Productivity and Material Intensity",
      path_ge: "მატერიალური ნაკადის ანგარიშები",
      path_en: "Material Flow Accounts",
    },
    {
      title_ge: "შიდა მატერიალური მოხმარება (შმმ) ერთ სულ მოსახლეზე",
      title_en: "Domestic Material Consumption (DMC) per Capita",
      path_ge: "მატერიალური ნაკადის ანგარიშები",
      path_en: "Material Flow Accounts",
    },
    {
      title_ge: "ადგილობრივი მოპოვება ტიპების მიხედვით",
      title_en: "Domestic Extraction by Types",
      path_ge: "მატერიალური ნაკადის ანგარიშები",
      path_en: "Material Flow Accounts",
    },
    {
      title_ge: "იმპორტის სტრუქტურა",
      title_en: "Import Structure",
      path_ge: "მატერიალური ნაკადის ანგარიშები",
      path_en: "Material Flow Accounts",
    },
    {
      title_ge: "ექსპორტის სტრუქტურა",
      title_en: "Export Structure",
      path_ge: "მატერიალური ნაკადის ანგარიშები",
      path_en: "Material Flow Accounts",
    },
    {
      title_ge: "ფიზიკური სავაჭრო ბალანსის (ფსბ) ტენდენცია",
      title_en: "Physical Trade Balance (PTB) Trend",
      path_ge: "მატერიალური ნაკადის ანგარიშები",
      path_en: "Material Flow Accounts",
    },
    {
      title_ge: "ფსბ მასალების ტიპების მიხედვით",
      title_en: "Physical Trade Balance (PTB) by Material Type",
      path_ge: "მატერიალური ნაკადის ანგარიშები",
      path_en: "Material Flow Accounts",
    },
    {
      title_ge: "წიაღისეული საწვავის წმინდა იმპორტი (ფსბ)",
      title_en: "Net Import of Fossil Fuels (PTB)",
      path_ge: "მატერიალური ნაკადის ანგარიშები",
      path_en: "Material Flow Accounts",
    },
    {
      title_ge: "ბიომასის მატერიალური ნაკადები",
      title_en: "Biomass Material Flows",
      path_ge: "მატერიალური ნაკადის ანგარიშები",
      path_en: "Material Flow Accounts",
    },
    {
      title_ge: "ლითონის მადნების სავაჭრო ბალანსი",
      title_en: "Metal Ores Trade Balance",
      path_ge: "მატერიალური ნაკადის ანგარიშები",
      path_en: "Material Flow Accounts",
    },
  ],
  biodiversity: [
    {
      protectedAreas: [
        {
          title_ge: "საქართველოს დაცული ტერიტორიები",
          title_en: "Protected Areas of Georgia of Georgia",
          path_ge: "საქართველოს დაცული ტერიტორიები",
          path_en: "Protected Areas of Georgia",
        },
        {
          title_ge: "ძირითადი მტაცებლები",
          title_en: "Key Predators",
          path_ge: "საქართველოს დაცული ტერიტორიები",
          path_en: "Protected Areas of Georgia",
        },
        {
          title_ge: "ძირითადი ბალახისმჭამელები",
          title_en: "Key Herbivores",
          path_ge: "საქართველოს დაცული ტერიტორიები",
          path_en: "Protected Areas of Georgia",
        },
        {
          title_ge: "ქურციკის პოპულაციის აღდგენა",
          title_en: "Restoration of The Kurtsik Population",
          path_ge: "საქართველოს დაცული ტერიტორიები",
          path_en: "Protected Areas of Georgia",
        },
        {
          title_ge: "ძუძუმწოვრები დაცულ ტერიტორიებზე",
          title_en: "Mammal in Protected Areas of Georgia",
          path_ge: "საქართველოს დაცული ტერიტორიები",
          path_en: "Protected Areas of Georgia",
        },
        {
          title_ge: "ძირითადი მტაცებელი ფრინველები",
          title_en: "Population of Major Birds of Prey",
          path_ge: "საქართველოს დაცული ტერიტორიები",
          path_en: "Protected Areas of Georgia",
        },
        {
          title_ge: "როჭო, ხოხობი, კაკაბი - პოპულაციების ტენდენცია",
          title_en:
            "Caucasian grouse, Pheasant, Rock partridge - population trends",
          path_ge: "საქართველოს დაცული ტერიტორიები",
          path_en: "Protected Areas of Georgia",
        },
        {
          title_ge: "ფრინველები დაცულ ტერიტორიებზე",
          title_en: "Bird in Protected Areas of Georgia",
          path_ge: "საქართველოს დაცული ტერიტორიები",
          path_en: "Protected Areas of Georgia",
        },
      ],
    },
    {
      forestarea: [
        {
          forestResources: [
            {
              title_ge:
                "მოჭრილი მერქნის მოცულობა, უკანონო ჭრა და ტყის განახლება საქართველოში (2013–2023)",
              title_en:
                "Volume of harvested timber, illegal logging and forest regeneration in Georgia (2013–2023)",
              path_ge: "ტყის რესურსები",
              path_en: "Forest Resources",
            },
            {
              title_ge: "ტყის ფონდის შემადგენლობა",
              title_en: "Composition of forest area",
              path_ge: "საქართველოს დაცული ტერიტორიები",
              path_en: "Protected Areas of Georgia",
            },
            {
              title_ge: "მოჭრილი მერქანი ჭრის მიზნისა და ტყის ტიპის მიხედვით",
              title_en: "Logged timber by cutting purpose and forest type",
              path_ge: "საქართველოს დაცული ტერიტორიები",
              path_en: "Protected Areas of Georgia",
            },
          ],
        },
      ],
    },
    {
      forestandfieldfires: [
        {
          title_ge: "ტყისა და ველის ხანძრები რეგიონების მიხედვით",
          title_en: "Forest and Field Fires by Regions",
          path_ge: "ტყისა და ველის ხანძრები",
          path_en: "Forest and Field Fires",
        },
      ],
    },
  ],
  water: [
    {
      majors: [
        {
          title_ge: "ძირითადი მდინარეები (სიგრძე ქვეყნის ტერიტორიაზე)",
          title_en: "Major rivers (length within the country)",
          path_ge: "საქართველოს მთავარი მდინარეები და ტბები",
          path_en: "Main Rivers and Lakes of Georgia",
        },
        {
          title_ge: "ძირითადი ტბები და წყალსაცავები",
          title_en: "Major lakes and reservoirs",
          path_ge: "საქართველოს მთავარი მდინარეები და ტბები",
          path_en: "Main Rivers and Lakes of Georgia",
        },
      ],
    },
    {
      protection: [
        {
          title_ge: "წყლის აღება ბუნებრივი ობიექტებიდან",
          title_en: "Water extraction from natural sources",
          path_ge:
            "ბუნებრივი ობიექტებიდან წყლის აღების ტენდენციები საქართველოში (2012-2023)",
          path_en:
            "Trends in Water Abstraction from Natural Sources in Georgia (2012-2023)",
        },
        {
          title_ge: "წყლის გამოყენება სექტორების მიხედვით",
          title_en: "Water use by sector",
          path_ge:
            "ბუნებრივი ობიექტებიდან წყლის აღების ტენდენციები საქართველოში (2012-2023)",
          path_en:
            "Trends in Water Abstraction from Natural Sources in Georgia (2012-2023)",
        },
        {
          title_ge:
            "წყლის დანაკარგები ტრანსპორტირებისას და ბრუნვითი და მეორადი მიმდევრობითი წყალმომარაგება",
          title_en:
            "Water losses during transportation and circulating and secondary sequential water supply",
          path_ge:
            "ბუნებრივი ობიექტებიდან წყლის აღების ტენდენციები საქართველოში (2012-2023)",
          path_en:
            "Trends in Water Abstraction from Natural Sources in Georgia (2012-2023)",
        },
        {
          title_ge: "ჩამდინარე წყლის ჩაშვება ზედაპირული წყლის ობიექტებში, სულ",
          title_en: "Wastewater discharge into surface water bodies, total",
          path_ge:
            "ბუნებრივი ობიექტებიდან წყლის აღების ტენდენციები საქართველოში (2012-2023)",
          path_en:
            "Trends in Water Abstraction from Natural Sources in Georgia (2012-2023)",
        },
        {
          title_ge: "წყლის გამოყენების განაწილება სექტორების მიხედვით, %",
          title_en: "Distribution of water use by sectors, %",
          path_ge:
            "ბუნებრივი ობიექტებიდან წყლის აღების ტენდენციები საქართველოში (2012-2023)",
          path_en:
            "Trends in Water Abstraction from Natural Sources in Georgia (2012-2023)",
        },
      ],
    },
    {
      supplyandlosses: [
        {
          title_ge:
            "წყალმომარაგების სისტემაში გაშვებული და აბონენტებისთვის მიწოდებული წყლის მოცულობა",
          title_en: "Water supply released and delivered to the supply system",
          path_ge:
            "წყალმომარაგება, დანაკარგები და შინამეურნეობების მიერ წყლის მოხმარება",
          path_en: "Water supply, losses and household water consumption",
        },
        {
          title_ge: "წყლის დანაკარგები ტრანსპორტირებისას (%)",
          title_en: "Water losses during transportation (%)",
          path_ge:
            "წყალმომარაგება, დანაკარგები და შინამეურნეობების მიერ წყლის მოხმარება",
          path_en: "Water supply, losses and household water consumption",
        },
        {
          title_ge:
            "წყალმომარაგების სისტემაზე მიერთებული მოსახლეობა vs. მოსახლეობა თვითმიწოდებით",
          title_en:
            "Population connected to the water supply system vs. population with self-supply",
          path_ge:
            "წყალმომარაგება, დანაკარგები და შინამეურნეობების მიერ წყლის მოხმარება",
          path_en: "Water supply, losses and household water consumption",
        },
        {
          title_ge: "წყალმომარაგების სისტემაზე მიერთებული მოსახლეობის %",
          title_en:
            "Percentage of population connected to the water supply system",
          path_ge:
            "წყალმომარაგება, დანაკარგები და შინამეურნეობების მიერ წყლის მოხმარება",
          path_en: "Water supply, losses and household water consumption",
        },
        {
          title_ge: "შინამეურნეობების მიერ წყლის მოხმარება ერთ სულზე (მ³/წელი)",
          title_en: "Water use per capita by households (m³/year)”",
          path_ge:
            "წყალმომარაგება, დანაკარგები და შინამეურნეობების მიერ წყლის მოხმარება",
          path_en: "Water supply, losses and household water consumption",
        },
        {
          title_ge:
            "შინამეურნეობების მიერ წყლის მოხმარება მიწოდების წყაროების მიხედვით (მლნ მ³)",
          title_en: "Households water use by water supply sources",
          path_ge:
            "წყალმომარაგება, დანაკარგები და შინამეურნეობების მიერ წყლის მოხმარება",
          path_en: "Water supply, losses and household water consumption",
        },
        {
          title_ge:
            "შინამეურნეობებისთვის მიწოდებული წყალი და მიერთებული მოსახლეობა",
          title_en: "Water supplied to households and connected population",
          path_ge:
            "წყალმომარაგება, დანაკარგები და შინამეურნეობების მიერ წყლის მოხმარება",
          path_en: "Water supply, losses and household water consumption",
        },
        {
          title_ge:
            "წყალმომარაგების სისტემაზე მიერთებული მოსახლეობის განაწილება (მლნ)",
          title_en:
            "Distribution of population connected to the water supply system (million)",
          path_ge:
            "წყალმომარაგება, დანაკარგები და შინამეურნეობების მიერ წყლის მოხმარება",
          path_en: "Water supply, losses and household water consumption",
        },
        {
          title_ge:
            "წყალარინების ქსელზე და ჩამდინარე წყლის გამწმენდ ნაგებობაზე მიერთებული მოსახლეობის %",
          title_en:
            "Share of population connected to wastewater collecting system and wastewater treatment facilities (%)",
          path_ge:
            "წყალმომარაგება, დანაკარგები და შინამეურნეობების მიერ წყლის მოხმარება",
          path_en: "Water supply, losses and household water consumption",
        },
        {
          title_ge:
            "მოსახლეობის რაოდენობა ჩამდინარე წყლის გაწმენდის ტიპის მიხედვით (მლნ)",
          title_en:
            "Distribution of population connected to wastewater treatment and sewage systems by type (million)",
          path_ge:
            "წყალმომარაგება, დანაკარგები და შინამეურნეობების მიერ წყლის მოხმარება",
          path_en: "Water supply, losses and household water consumption",
        },
        {
          title_ge: "მოსახლეობა ჩამდინარე წყლის გაწმენდის ტიპის მიხედვით (%)",
          title_en:
            "Share of population connected to wastewater treatment facilities by type (%)",
          path_ge:
            "წყალმომარაგება, დანაკარგები და შინამეურნეობების მიერ წყლის მოხმარება",
          path_en: "Water supply, losses and household water consumption",
        },
        {
          title_ge:
            "წყალარინების ქსელზე მიერთებული მოსახლეობა, ჩამდინარე წყლის გაწმენდის გარეშე",
          title_en:
            "Population connected to wastewater collecting system without subsequent treatment",
          path_ge:
            "წყალმომარაგება, დანაკარგები და შინამეურნეობების მიერ წყლის მოხმარება",
          path_en: "Water supply, losses and household water consumption",
        },
        {
          title_ge:
            "წყალმომარაგების სისტემაზე მიერთებული მოსახლეობა, წყალარინების ქსელზე მიერთების გარეშე",
          title_en:
            "Population connected to water supply industry without connection to a wastewater collecting system",
          path_ge:
            "წყალმომარაგება, დანაკარგები და შინამეურნეობების მიერ წყლის მოხმარება",
          path_en: "Water supply, losses and household water consumption",
        },
      ],
    },
  ],
  climate: [
    {
      disasters: [
        {
          title_ge:
            "სიკვდიალიანობის წლიური დინამიკა (ყველა სტიქიური მოვლენის დროს)",
          title_en: "Annual mortality dynamics (during all natural events)",
          path_ge: "სტიქიური მოვლენები საქართველოში",
          path_en: "Natural Disasters in Georgia",
        },
        {
          title_ge: "ჰიდრომეტეოროლოგიური მოვლენების ყოველთვიური რუკა",
          title_en: "Monthly map of hydrometeorological events",
          path_ge: "სტიქიური მოვლენები საქართველოში",
          path_en: "Natural Disasters in Georgia",
        },
        {
          title_ge:
            "გეოლოგიური მოვლენები და მასთან დაკავშირებული სიკვდილიანობა",
          title_en: "Geological events and related mortality",
          path_ge: "სტიქიური მოვლენები საქართველოში",
          path_en: "Natural Disasters in Georgia",
        },
        {
          title_ge: "წლიური ჰიდრომეტეოროლოგიური მოვლენები ტიპების მიხედვით",
          title_en: "Annual hydrometeorological events by type",
          path_ge: "სტიქიური მოვლენები საქართველოში",
          path_en: "Natural Disasters in Georgia",
        },
        {
          title_ge: "სეზონური სტიქიური მოვლენები",
          title_en: "Seasonal Natural Disasters",
          path_ge: "სტიქიური მოვლენები საქართველოში",
          path_en: "Natural Disasters in Georgia",
        },
        {
          title_ge: "სტიქიური მოვლენების ჯამური შემთხვევები და სიკვდილიანობა",
          title_en: "Natural Disaster Profile: Total Incidents and Mortality",
          path_ge: "სტიქიური მოვლენები საქართველოში",
          path_en: "Natural Disasters in Georgia",
        },
        {
          title_ge: "გეოლოგიური და ჰიდრომეტეოროლოგიური მოვლენების ტენდენციები",
          title_en: "Trends in geological and hydrometeorological events",
          path_ge: "სტიქიური მოვლენები საქართველოში",
          path_en: "Natural Disasters in Georgia",
        },
        {
          title_ge: "ზეგავლენა ინფრასტრუქტურასა და დასახლებულ პუნქტებზე",
          title_en: "Impact on infrastructure and settlements",
          path_ge: "სტიქიური მოვლენები საქართველოში",
          path_en: "Natural Disasters in Georgia",
        },
        {
          title_ge:
            "გეოლოგიური კატასტროფები ათწლეულების ჭრილში (ჯამური შემთხვევები)",
          title_en:
            "Geological disasters by decade (total number of incidents)",
          path_ge: "სტიქიური მოვლენები საქართველოში",
          path_en: "Natural Disasters in Georgia",
        },
      ],
    },
    {
      temperature: [
        {
          title_ge: "საშუალო წლიური ტემპერატურა საქართველოში",
          title_en: "Georgia's average annual temperature",
          path_ge: "ჰაერის ტემპერატურა",
          path_en: "Air Temperature",
        },
        {
          title_ge:
            "წლიური ტემპერატურული ანომალია საქართველოში, გადახრა 1961-1990 წლების საშუალოდან",
          title_en:
            "Georgia's annual temperature anomaly, deviation from the 1961-1990 average",
          path_ge: "ჰაერის ტემპერატურა",
          path_en: "Air Temperature",
        },
        {
          title_ge:
            "ქვეყნის, თბილისისა და ყველაზე გრილი და თბილი რეგიონების ტემპერატურის ტენდენციები",
          title_en:
            "Temperature trends of the coldest and warmest regions of the country and Tbilisi",
          path_ge: "ჰაერის ტემპერატურა",
          path_en: "Air Temperature",
        },
        {
          title_ge:
            "ექსტრემალური ცვლილებები: თბილისის ყველაზე ცხელი და ცივი თვეების საშუალო ტემპერატურა",
          title_en:
            "Extreme changes: Average temperatures of Tbilisi's hottest and coldest months",
          path_ge: "ჰაერის ტემპერატურა",
          path_en: "Air Temperature",
        },
        {
          title_ge: "გურიის პროფილი (2022 წ. საბაზისოსთან შედარებით)",
          title_en: "Guria Profile (Compared to 2022 Baseline)",
          path_ge: "ჰაერის ტემპერატურა",
          path_en: "Air Temperature",
        },
        {
          title_ge:
            "ყველაზე ცხელი წლები 1990 წლიდან დღემდე: ტოპ 7 ტემპერატურული გადახრის მიხედვით",
          title_en:
            "The hottest years since 1990: Top 7 by temperature deviation",
          path_ge: "ჰაერის ტემპერატურა",
          path_en: "Air Temperature",
        },
      ],
    },
    {
      precipitation: [
        {
          title_ge: "წლიური ნალექების ტენდენცია საქართველოში",
          title_en: "Annual comparison in Georgia",
          path_ge: "ატმოსფერული ნალექები",
          path_en: "Atmospheric Precipitation",
        },
        {
          title_ge: "გადახრა 1961-1990 წლების საშუალოდან",
          title_en: "Deviation from the 1961-1990 average",
          path_ge: "ატმოსფერული ნალექები",
          path_en: "Atmospheric Precipitation",
        },
        {
          title_ge: "თვიური ნალექების დიაპაზონი",
          title_en: "Monthly precipitation range",
          path_ge: "ატმოსფერული ნალექები",
          path_en: "Atmospheric Precipitation",
        },
        {
          title_ge:
            "წლიური ნალექები ქვეყნის, თბილისის და ყველაზე უხვი და მცირე ნალექიანი რეგიონების მიხედვით",
          title_en:
            "Annual precipitation by region, Tbilisi, Georgia, with the most and least precipitation",
          path_ge: "ატმოსფერული ნალექები",
          path_en: "Atmospheric Precipitation",
        },
        {
          title_ge:
            "ისტორიული საშუალო ნალექიანობა რეგიონების მიხედვით (1961-1990)",
          title_en: "Historical average precipitation by region (1961-1990)",
          path_ge: "ატმოსფერული ნალექები",
          path_en: "Atmospheric Precipitation",
        },
        {
          title_ge: "ნალექიანობის ექსტრემალური წლები",
          title_en: "Extreme precipitation years",
          path_ge: "ატმოსფერული ნალექები",
          path_en: "Atmospheric Precipitation",
        },
        {
          title_ge: "თვიური ნალექების დიაპაზონი რეგიონების მიხედვით (2022)",
          title_en: "Monthly precipitation range by region (2022)",
          path_ge: "ატმოსფერული ნალექები",
          path_en: "Atmospheric Precipitation",
        },
        {
          title_ge: "წლიური vs. მაქსიმალური თვიური ნალექი",
          title_en: "Annual vs. Maximum Monthly Precipitation",
          path_ge: "ატმოსფერული ნალექები",
          path_en: "Atmospheric Precipitation",
        },
        {
          title_ge: "ექსტრემალური მაჩვენებლების ტენდენცია საქართველოში",
          title_en: "Trend of extreme indicators in Georgia",
          path_ge: "ატმოსფერული ნალექები",
          path_en: "Atmospheric Precipitation",
        },
        {
          title_ge: "2022 წლის ნალექები ისტორიულ საშუალოსთან შედარებით",
          title_en: "2022 precipitation compared to historical average",
          path_ge: "ატმოსფერული ნალექები",
          path_en: "Atmospheric Precipitation",
        },
        {
          title_ge: "წლიური ნალექების თერმული რუკა (საქართველო)",
          title_en: "Thermal map of annual precipitation (Georgia)",
          path_ge: "ატმოსფერული ნალექები",
          path_en: "Atmospheric Precipitation",
        },
        {
          title_ge: "ნალექების დეტალური მონაცემები (2022)",
          title_en: "Detailed precipitation data (2022)",
          path_ge: "ატმოსფერული ნალექები",
          path_en: "Atmospheric Precipitation",
        },
      ],
    },
    {
      emissions: [
        {
          title_ge: "წყალმომარაგების სისტემაში გაშვებული და მიწოდებული წყალი",
          title_en: "Water supply released and delivered to the supply system",
          path_ge:
            "წყალმომარაგება, დანაკარგები და შინამეურნეობების მიერ წყლის მოხმარება",
          path_en: "Water supply, losses and household water consumption",
        },
      ],
    },
  ],
};

function normalizeCharts(data, fallbackPrefix = "chart") {
  const usedIds = new Set();

  if (Array.isArray(data)) {
    return data.map((item, index) => {
      const keys = Object.keys(item);
      if (keys.length === 1 && Array.isArray(item[keys[0]])) {
        const key = keys[0];
        return {
          [key]: normalizeCharts(item[key], `${fallbackPrefix}-${key}`),
        };
      }

      // Generate cleaned chartID from title_en
      let rawId = item.title_en || `${fallbackPrefix}-${index}`;
      let chartID = cleanId(rawId, fallbackPrefix, index);

      // Ensure uniqueness
      let uniqueID = chartID;
      let suffix = 1;
      while (usedIds.has(uniqueID)) {
        uniqueID = `${chartID}-${suffix++}`;
      }
      usedIds.add(uniqueID);

      return {
        ...item,
        chartID: uniqueID,
      };
    });
  }

  return data;
}

const Charts = Object.fromEntries(
  Object.entries(rawCharts).map(([path, charts]) => [
    path,
    normalizeCharts(charts, path),
  ])
);

export default Charts;
