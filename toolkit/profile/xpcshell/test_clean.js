/*
 * Tests from a clean state.
 * Then does some testing that creating new profiles and marking them as
 * selected works.
 */

add_task(async () => {
  let service = getProfileService();

  let target = gDataHome.clone();
  target.append("profiles.ini");
  Assert.ok(!target.exists(), "profiles.ini should not exist yet.");
  target.leafName = "installs.ini";
  Assert.ok(!target.exists(), "installs.ini should not exist yet.");

  // Create a new profile to use.
  let newProfile = service.createProfile(null, "dedicated");
  service.flush();

  let profileData = readProfilesIni();
  let installData = readInstallsIni();

  Assert.ok(profileData.options.startWithLastProfile, "Should be set to start with the last profile.");
  Assert.equal(profileData.profiles.length, 1, "Should have the right number of profiles.");

  let profile = profileData.profiles[0];
  Assert.equal(profile.name, "dedicated", "Should have the right name.");
  Assert.ok(!profile.default, "Should not be marked as the old-style default.");

  // The new profile hasn't been marked as the default yet!
  Assert.equal(Object.keys(installData.installs).length, 0, "Should be no defaults for installs yet.");

  checkProfileService(profileData, installData);

  service.defaultProfile = newProfile;
  service.flush();

  profileData = readProfilesIni();
  installData = readInstallsIni();

  Assert.ok(profileData.options.startWithLastProfile, "Should be set to start with the last profile.");
  Assert.equal(profileData.profiles.length, 1, "Should have the right number of profiles.");

  profile = profileData.profiles[0];
  Assert.equal(profile.name, "dedicated", "Should have the right name.");
  Assert.ok(!profile.default, "Should not be marked as the old-style default.");

  let hash = xreDirProvider.getInstallHash();
  Assert.equal(Object.keys(installData.installs).length, 1, "Should be only one known install.");
  Assert.equal(installData.installs[hash].default, profileData.profiles[0].path, "Should have marked the new profile as the default for this install.");

  checkProfileService(profileData, installData);

  let otherProfile = service.createProfile(null, "another");
  service.defaultProfile = otherProfile;

  service.flush();

  profileData = readProfilesIni();
  installData = readInstallsIni();

  Assert.ok(profileData.options.startWithLastProfile, "Should be set to start with the last profile.");
  Assert.equal(profileData.profiles.length, 2, "Should have the right number of profiles.");

  profile = profileData.profiles[0];
  Assert.equal(profile.name, "another", "Should have the right name.");
  Assert.ok(!profile.default, "Should not be marked as the old-style default.");

  profile = profileData.profiles[1];
  Assert.equal(profile.name, "dedicated", "Should have the right name.");
  Assert.ok(!profile.default, "Should not be marked as the old-style default.");

  Assert.equal(Object.keys(installData.installs).length, 1, "Should be only one known install.");
  Assert.equal(installData.installs[hash].default, profileData.profiles[0].path, "Should have marked the new profile as the default for this install.");

  checkProfileService(profileData, installData);

  newProfile.remove(true);
  service.flush();

  profileData = readProfilesIni();
  installData = readInstallsIni();

  Assert.ok(profileData.options.startWithLastProfile, "Should be set to start with the last profile.");
  Assert.equal(profileData.profiles.length, 1, "Should have the right number of profiles.");

  profile = profileData.profiles[0];
  Assert.equal(profile.name, "another", "Should have the right name.");
  Assert.ok(!profile.default, "Should not be marked as the old-style default.");

  Assert.equal(Object.keys(installData.installs).length, 1, "Should be only one known install.");
  Assert.equal(installData.installs[hash].default, profileData.profiles[0].path, "Should have marked the new profile as the default for this install.");

  checkProfileService(profileData, installData);

  otherProfile.remove(true);
  service.flush();

  profileData = readProfilesIni();
  installData = readInstallsIni();

  Assert.ok(profileData.options.startWithLastProfile, "Should be set to start with the last profile.");
  Assert.equal(profileData.profiles.length, 0, "Should have the right number of profiles.");

  // We leave a reference to the missing profile to stop us trying to steal the
  // old-style default profile on next startup.
  Assert.equal(Object.keys(installData.installs).length, 1, "Should be only one known install.");

  checkProfileService(profileData, installData);
});
