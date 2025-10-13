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
      title_ge: "მოხმარების ზრდა სექტორების მიხედვით",
      title_en: "According to Consumption Growth",
      path_ge: "საქართველოს ენერგეტიკის გარემოსდაცვითი მაჩვენებლები",
      path_en: "environmental performance of georgian energy sector",
    },
    {
      title_ge: "მოხმარების სტრუქტურა",
      title_en: "Consumption Structure",
      path_ge: "საქართველოს ენერგეტიკის გარემოსდაცვითი მაჩვენებლები",
      path_en: "environmental performance of georgian energy sector",
    },
    {
      title_ge: "მოხმარების სექტორების მიხედვით (%)",
      title_en: "By Consumption Sectors (%)",
      path_ge: "საქართველოს ენერგეტიკის გარემოსდაცვითი მაჩვენებლები",
      path_en: "environmental performance of georgian energy sector",
    },
    {
      title_ge: "პირველადი მომარაგების შემადგენლობა",
      title_en: "Composition of Primary Supply",
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
      title_ge: "განახლებადი ენერგიის მომარაგების ზრდა ტიპების მიხედვით",
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
      title_ge: "შიდა მატერიალური მოხმარება და მშპ",
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
  nature: [
    {
      protectedAreas: [
        {
          title_ge: "საქართველოს დაცული ტერიტორიები",
          title_en: "Protected areas of Georgia",
          path_ge: "ტყის ფართობი",
          path_en: "Protected Areas",
        },
        {
          title_ge: "ძირითადი მტაცებლების პოპულაციები",
          title_en: "Populations of Key redators",
          path_ge: "ტყის ფართობი",
          path_en: "Protected Areas",
        },
        {
          title_ge: "ბალახისმჭამელების პოპულაციები",
          title_en: "Herbivore Populations",
          path_ge: "ტყის ფართობი",
          path_en: "Protected Areas",
        },
        {
          title_ge: "ქურციკის პოპულაციის აღდგენა",
          title_en: "Restoration of The Kurtsik Population",
          path_ge: "ტყის ფართობი",
          path_en: "Protected Areas",
        },
        {
          title_ge: "ძუძუმწოვრების პოპულაციები დაცულ ტერიტორიებზე",
          title_en: "Mammal Populations in Protected Areas",
          path_ge: "ტყის ფართობი",
          path_en: "Protected Areas",
        },
        {
          title_ge: "ძირითადი მტაცებელი ფრინველების პოპულაციები",
          title_en: "Population of Major Birds of Prey",
          path_ge: "ტყის ფართობი",
          path_en: "Protected Areas",
        },
        {
          title_ge: "სანადირო ფრინველების პოპულაციები",
          title_en: "Populations of Game Birds",
          path_ge: "ტყის ფართობი",
          path_en: "Protected Areas",
        },
        {
          title_ge: "ფრინველების პოპულაციები დაცულ ტერიტორიებზე",
          title_en: "Bird Populations in Protected Areas",
          path_ge: "ტყის ფართობი",
          path_en: "Protected Areas",
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
          ],
        },
        {
          timber: [
            {
              title_ge: "",
              title_en: "",
              path_ge: "დაუმუშავებელი მერქნის იმპორტი და ექსპორტი",
              path_en: "Import and Export of Unprocessed Timber",
            },
          ],
        },
        {
          inventorization: [
            {
              title_ge: "",
              title_en: "",
              path_ge: "ტყის ეროვნული ინვენტარიზაცია",
              path_en: "National Forest Inventory",
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
          title_ge: "ძირითადი მდინარეები",
          title_en: "Major rivers",
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
            "ბუნებრივი ობიექტებიდან წყლის აღების ტრენდები საქართველოში (2017-2023)",
          path_en:
            "Trends in Water Abstraction from Natural Sources in Georgia (2017-2023)",
        },
        {
          title_ge: "წყლის გამოყენება სექტორების მიხედვით",
          title_en: "Water use by sector",
          path_ge:
            "ბუნებრივი ობიექტებიდან წყლის აღების ტრენდები საქართველოში (2017-2023)",
          path_en:
            "Trends in Water Abstraction from Natural Sources in Georgia (2017-2023)",
        },
        {
          title_ge:
            "წყლის დანაკარგები ტრანსპორტირებისას და ბრუნვითი და მეორადი მიმდევრობითი წყალმომარაგება",
          title_en:
            "Water losses during transportation and circulating and secondary sequential water supply",
          path_ge:
            "ბუნებრივი ობიექტებიდან წყლის აღების ტრენდები საქართველოში (2017-2023)",
          path_en:
            "Trends in Water Abstraction from Natural Sources in Georgia (2017-2023)",
        },
        {
          title_ge: "ჩამდინარე წყლის ჩაშვება ზედაპირული წყლის ობიექტებში, სულ",
          title_en: "Wastewater discharge into surface water bodies, total",
          path_ge:
            "ბუნებრივი ობიექტებიდან წყლის აღების ტრენდები საქართველოში (2017-2023)",
          path_en:
            "Trends in Water Abstraction from Natural Sources in Georgia (2017-2023)",
        },
        {
          title_ge: "წყლის გამოყენების განაწილება სექტორების მიხედვით, %",
          title_en: "Distribution of water use by sectors, %",
          path_ge:
            "ბუნებრივი ობიექტებიდან წყლის აღების ტრენდები საქართველოში (2017-2023)",
          path_en:
            "Trends in Water Abstraction from Natural Sources in Georgia (2017-2023)",
        },
      ],
    },
    {
      supplyandlosses: [
        {
          title_ge: "წყალმომარაგების სისტემაში გაშვებული და მიწოდებული წყალი",
          title_en: "Water supply released and delivered to the supply system",
          path_ge:
            "წყალმომარაგება, დანაკარგები და შინამეურნეობების მიერ წყლის მოხმარება",
          path_en: "Water supply, losses and household water consumption",
        },
        {
          title_ge: "წყლის დანაკარგის პროცენტი ტრანსპორტირებისას",
          title_en: "Water loss percentage during transportation",
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
          title_en: "Water consumption per capita by households (m³/year)",
          path_ge:
            "წყალმომარაგება, დანაკარგები და შინამეურნეობების მიერ წყლის მოხმარება",
          path_en: "Water supply, losses and household water consumption",
        },
        {
          title_ge: "შინამეურნეობების მიერ წყლის მოხმარების წყაროები (მლნ მ³)",
          title_en: "Water consumption sources by households (million m³)",
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
            "წყალარინებაზე და ჩამდინარე წყლის გაწმენდაზე მიერთებული მოსახლეობის %",
          title_en:
            "Distribution of population connected to wastewater treatment and sewage systems (%)",
          path_ge:
            "წყალმომარაგება, დანაკარგები და შინამეურნეობების მიერ წყლის მოხმარება",
          path_en: "Water supply, losses and household water consumption",
        },
        {
          title_ge:
            "ჩამდინარე წყლების გაწმენდის ტიპის მიხედვით მოსახლეობის რაოდენობა (მლნ)",
          title_en:
            "Distribution of population connected to wastewater treatment and sewage systems by type (million)",
          path_ge:
            "წყალმომარაგება, დანაკარგები და შინამეურნეობების მიერ წყლის მოხმარება",
          path_en: "Water supply, losses and household water consumption",
        },
        {
          title_ge:
            "ჩამდინარე წყლების გაწმენდის ტიპის მიხედვით მოსახლეობის რაოდენობა (%)",
          title_en:
            "Distribution of population connected to wastewater treatment and sewage systems by type (%)",
          path_ge:
            "წყალმომარაგება, დანაკარგები და შინამეურნეობების მიერ წყლის მოხმარება",
          path_en: "Water supply, losses and household water consumption",
        },
        {
          title_ge:
            "წყალარინების ქსელზე მიერთებული მოსახლეობა, ჩამდინარე წყლის გაწმენდის გარეშე",
          title_en:
            "Distribution of population connected to wastewater treatment and sewage systems without treatment",
          path_ge:
            "წყალმომარაგება, დანაკარგები და შინამეურნეობების მიერ წყლის მოხმარება",
          path_en: "Water supply, losses and household water consumption",
        },
        {
          title_ge:
            "წყალმომარაგების სისტემაზე მიერთებული მოსახლეობა, წყალარინების ქსელზე მიერთების გარეშე",
          title_en:
            "Distribution of population connected to wastewater treatment and sewage systems without treatment",
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
