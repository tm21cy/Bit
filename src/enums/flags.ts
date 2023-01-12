/**
 * Enumerator for all the valid flag values used in the profile system.
 */
enum Flags {
  None = 0,
  Root = 1,
  SeniorMod = 2,
  Mod = 4,
  TrialMod = 8,
  Proficient = 32,
  Fluent = 64,
  Active = 128,
  Regular = 256,
  ServerPartner = 512,
  TrustedMember = 1024,
  EarlyMember = 2048,
  BetaContributor = 4096,
  BetaBugHunter = 8192,
  Retired = 16384,
  EventWinner = 32768,
  ServerBooster = 65536,
  FeedbackPal = 131072,
  AnnoyedStaff = 262144,
}

export default Flags;
