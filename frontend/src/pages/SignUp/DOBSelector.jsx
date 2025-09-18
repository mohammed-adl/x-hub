import styles from "./SignUp.module.css";

function DOBSelector({ birthDate, setBirthDate }) {
  const handleDobSelect = (e) => {
    const { name, value } = e.target;
    setBirthDate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <h3 className={styles.signupSubheading}>Date of Birth</h3>
      <p className={styles.signupDescription}>
        This will not be shown publicly. Confirm your own age, even if this
        account is for a business, a pet, or something else.
      </p>

      <div className={styles.signupDob}>
        <select
          name="month"
          className={styles.signupSelect}
          value={birthDate.month}
          onChange={handleDobSelect}
        >
          <option value="">Month</option>
          {[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].map((month, i) => (
            <option key={i + 1} value={i + 1}>
              {month}
            </option>
          ))}
        </select>

        <select
          name="day"
          className={styles.signupSelect}
          value={birthDate.day}
          onChange={handleDobSelect}
        >
          <option value="">Day</option>
          {Array.from({ length: 31 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>

        <select
          name="year"
          className={styles.signupSelect}
          value={birthDate.year}
          onChange={handleDobSelect}
        >
          <option value="">Year</option>
          {Array.from({ length: 100 }, (_, i) => {
            const year = new Date().getFullYear() - i;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
      </div>
    </>
  );
}

export default DOBSelector;
