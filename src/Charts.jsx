// Utility function to clean and normalize ID strings
function cleanId(id, fallback = "untitled", index = 0) {
  if (!id) return `${fallback}-${index}`;
  return id
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, ""); // Remove non-alphanumeric except hyphens
}

const rawCharts = {
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
      title_ge: "რეპორტების ჩარტი",
      title_en: "reports charts",
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
        },
      ],
      forestarea: [
        {
          title_ge:
            "მოჭრილი მერქნის მოცულობა, უკანონო ჭრა და ტყის განახლება საქართველოში (2013–2023)",
          title_en:
            "Volume of harvested timber, illegal logging and forest regeneration in Georgia (2013–2023)",
          path_ge: "ტყის ფართობი",
          path_en: "Forest Area",
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
      protection: [],
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

// Recursively normalize chart objects
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

// Apply normalization to each top-level path
const Charts = Object.fromEntries(
  Object.entries(rawCharts).map(([path, charts]) => [
    path,
    normalizeCharts(charts, path),
  ])
);

export default Charts;
