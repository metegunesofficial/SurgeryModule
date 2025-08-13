# Changelog

All notable changes for the Ameliyathane ve Sterilizasyon PRD compliance will be documented in this file.

## 2025-08-11

- Added PRD Uyum page at route `/uyum` reading `docs/ameliyathane-sterilizasyon-prd.tr.json` and rendering:
  - Module, submodule, feature, equipment listings
  - Requirements sections: functional, performance, user, physical, legal, error_handling
  - Standards list with totals and per-section totals (data-testids for automation)
- Updated prerender routes to include `/uyum` in `react-router.config.ts`
- Added tests `src/app/uyum/__tests__/page.test.tsx`
- Extended `COMPLIANCE_TODO.md` with PRD compliance section for `/uyum`
- Updated `README.md` with PRD Uyum documentation

- Introduced schemas and stores for PRD execution:
  - Zod types for surgery and sterilization entities in `src/types/prd.ts`
  - Surgery planning store with conflict detection in `src/stores/surgeryPlanning.ts`
  - Sterilization store for kits/cycles/scan events in `src/stores/sterilization.ts`
  - Hooks: `useConflictSummary`, `useKitStatuses` and tests added
  - RBAC action schema in `src/lib/rbac.ts`, i18n skeleton in `src/lib/i18n.ts`
  - Integration maps (HL7 v2 / FHIR) in `src/lib/integrations/maps.ts`
  - Mock device cycle generator in `src/lib/devices/mockDevice.ts`


