import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useUser } from "../../contexts";
import { BackButton } from "../../components/ui";
import { handleEditProfile } from "../../fetchers";
import styles from "./EditProfile.module.css";

export default function EditProfile() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user.name,
    bio: user.bio || "",
    profilePicture: null,
    coverImage: null,
  });

  const [previewImages, setPreviewImages] = useState({
    profilePicture: user.profilePicture || null,
    coverImage: user.coverImage || null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, imageType) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [imageType]: file }));
      setPreviewImages((prev) => ({
        ...prev,
        [imageType]: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = new FormData();
    body.append("name", formData.name);
    body.append("bio", formData.bio);
    if (formData.profilePicture)
      body.append("profilePicture", formData.profilePicture);
    if (formData.coverImage) body.append("coverImage", formData.coverImage);

    try {
      const data = await handleEditProfile(body);
      setUser({ ...user, ...data.user });
      navigate(-1);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className={styles.editProfile}>
      <div className={styles.header}>
        <BackButton />
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Edit Profile</h2>
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.imageSection}>
          <div className={styles.coverImageContainer}>
            <div className={styles.coverImage}>
              {previewImages.coverImage && (
                <img src={previewImages.coverImage} alt="Cover Preview" />
              )}
              <label className={styles.imageUploadLabel}>
                <input
                  type="file"
                  name="coverImage"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, "coverImage")}
                  className={styles.hiddenInput}
                />
                <div className={styles.uploadIcon}>📷</div>
              </label>
            </div>
          </div>

          <div className={styles.profilePictureContainer}>
            <div className={styles.profilePicture}>
              {previewImages.profilePicture && (
                <img src={previewImages.profilePicture} alt="Profile Preview" />
              )}
              <label className={styles.imageUploadLabel}>
                <input
                  type="file"
                  name="profilePicture"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, "profilePicture")}
                  className={styles.hiddenInput}
                />
                <div className={styles.uploadIcon}>📷</div>
              </label>
            </div>
          </div>
        </div>

        <div className={styles.formFields}>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={styles.input}
              maxLength="50"
            />
            <div className={styles.charCount}>{formData.name.length}/50</div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="bio">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className={styles.textarea}
              rows="3"
              maxLength="160"
              placeholder="Tell the world about yourself"
            />
            <div className={styles.charCount}>{formData.bio.length}/160</div>
          </div>
        </div>

        <button type="submit" className={styles.saveButton}>
          Save Changes
        </button>
      </form>
    </div>
  );
}
