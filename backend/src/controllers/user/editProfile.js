import asyncHandler from "express-async-handler";
import { prisma, userSelect, success } from "../../lib/index.js";
import { attachFullUrls } from "../../utils/index.js";

export const editProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { name, bio } = req.body;

  const profilePictureFile = req.files?.profilePicture?.[0];
  const coverImageFile = req.files?.coverImage?.[0];

  const dataToUpdate = {
    name,
    bio,
  };

  if (profilePictureFile)
    dataToUpdate.profilePicture = profilePictureFile.relativePath;
  if (coverImageFile) dataToUpdate.coverImage = coverImageFile.relativePath;

  const user = await prisma.xUser.update({
    where: { id: userId },
    data: dataToUpdate,
    select: userSelect,
  });

  const userWithUrls = attachFullUrls(user);

  return success(res, { user: userWithUrls });
});
