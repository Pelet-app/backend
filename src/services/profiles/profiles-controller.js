import ProfilesRepositories from './profiles-repositories.js';

const profilesRepositories = new ProfilesRepositories();

export const getMyProfile = async (req, res, next) => {
  try {
    const profile = await profilesRepositories.getProfileByUserIdWithSkills(req.user.id);

    const roleData = req.user.role === 'hrd'
      ? { hrdData: profile.hrd_data }
      : {
        applicantData: profile.applicant_data,
        extractedSkills: profile.extracted_skills || [],
      };

    return res.status(200).json({
      status: 'success',
      data: {
        profile: {
          id: profile.id,
          userId: profile.user_id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          fullName: profile.full_name,
          phoneNumber: profile.phone_number,
          address: profile.address,
          avatarUrl: profile.avatar_url,
          updatedAt: profile.updated_at,
          ...roleData,
        },
      },
    });
  } catch (err) {
    return next(err);
  }
};

export const updateMyProfile = async (req, res, next) => {
  try {
    const updated = await profilesRepositories.updateProfile(
      req.user.id,   // userId dari JWT
      req.user.role, // role dari JWT → tentukan JSONB mana
      req.body,      // payload sudah divalidasi Joi
    );

    return res.status(200).json({
      status: 'success',
      message: 'Profil berhasil diperbarui',
      data: { profile: updated },
    });
  } catch (err) {
    return next(err);
  }
};