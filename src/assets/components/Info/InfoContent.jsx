import { useParams } from "react-router-dom";

const InfoContent = ({ text }) => {
  const { language } = useParams();

  const isEnglish = language === "en";

  return (
    <div className="info-content">
      {text && <p>{text[language]}</p>}

      {!text && (
        <>
          {!isEnglish && (
            <p>
              ქვემოთ მოცემული დიაგრამა გვიჩვენებს საქართველოს მთავარ ტბებსა და
              წყალსაცავებს.
              <span style={{ fontWeight: 900, fontFamily: "FiraGORegular" }}>
                {" "}
                თითოეული მართკუთხედის ზომა{" "}
              </span>
              პირდაპირ შეესაბამება წყლის ობიექტის
              <span style={{ fontWeight: 900, fontFamily: "FiraGORegular" }}>
                {" "}
                მოცულობას (მლნ. მ³-ში).{" "}
              </span>
            </p>
          )}

          {isEnglish && (
            <>
              <p>
                The diagram below shows the main lakes and reservoirs of
                Georgia.
                <span style={{ fontWeight: 900, fontFamily: "FiraGORegular" }}>
                  {" "}
                  The size of each rectangle{" "}
                </span>
                directly corresponds to the
                <span style={{ fontWeight: 900, fontFamily: "FiraGORegular" }}>
                  {" "}
                  volume of the water body (in million m³).{" "}
                </span>
              </p>
            </>
          )}

          <p style={{ marginTop: "10px" }}>
            {language === "en"
              ? "This visualization allows you to easily compare which reservoirs have the most capacity. Hover your mouse over any rectangle to see detailed information."
              : "ეს ვიზუალიზაცია საშუალებას გაძლევთ მარტივად შეადაროთ, რომელი წყალსაცავებია ყველაზე ტევადი. გადაატარეთ მაუსი ნებისმიერ მართკუთხედზე დეტალური ინფორმაციის სანახავად."}
          </p>
        </>
      )}
    </div>
  );
};

export default InfoContent;
