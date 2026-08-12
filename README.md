# CareOps Indonesia

CareOps Indonesia is a working demo for homecare agencies. It coordinates visits, caregiver notes, handovers, incidents, and reviewed family updates in one operational workspace.

## Scope

- Coordinator dashboard
- Caregiver mobile workflow
- Family update view
- Client and caregiver records
- Visit scheduling and status changes
- Care notes and documentation alerts
- Shift handover summary
- AI-assisted family update draft flow (simulated, review required)
- Search and filtering
- Demo role switching
- Responsive desktop and mobile layouts

All records in the demo are simulated. CareOps is not a medical diagnosis or medication advice system.

## Run locally

```bash
npm install
npm run dev
```

## Verify production build

```bash
npm run build
```

## Demo flow

1. Keep **Koordinator** selected and open **Kunjungan**.
2. Open a scheduled visit and click **Mulai**.
3. Switch role to **Caregiver**.
4. Open the active visit and save a care note, then complete the visit.
5. Switch back to **Koordinator** and open **Catatan & Insiden**.
6. Generate and approve the family update.
7. Switch role to **Keluarga** to view the approved update.

## Copy standard

The product uses natural, professional Indonesian copy. AI-generated text is presented as a draft that must be reviewed by a coordinator.
