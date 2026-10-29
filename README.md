# Customer and Service Management

Tracks customers from first contact through sales and ongoing service. It runs entirely in the browser: no server, no build step, nothing sent anywhere.

## Running it

Open `index.html` in a current browser. Do not open the `.js` files directly.

## Signing in

- The first account you create is the **administrator**; later accounts are **staff**. Staff cannot see Delete buttons.
- **Try the demo account** signs you in as `demo` / `demo1234` (administrator).
- Administrators can add users, change roles and remove accounts. Everyone can change their own password.
- Five wrong passwords lock sign-in for 30 seconds.

## The customer journey

1. **Customers:** add someone as a lead. Open **View** to see their deals, tickets, and a dated notes history of calls and meetings. Set their status to lead, active, or inactive.
2. **Sales:** add a deal for a customer and move it through new, contacted, quoted, won, or lost. Marking a deal **won** turns a lead into an active customer.
3. **Service:** log requests from customers with a priority, then move them from open to in progress to resolved.
4. **Dashboard:** open leads, pipeline value, won revenue, a stage-by-stage pipeline summary, and open tickets with the highest priority first.

Customers and tickets can be exported to CSV. Deleting a customer also removes their deals, tickets and notes.

## Structure

```
customer-service-system/
├── index.html           Page markup; loads scripts in order
├── css/styles.css       All styling
└── js/
    ├── utils.js         Shared helpers
    ├── auth.js          Sign-in, roles, user management
    ├── data.js          Stored data, sample records, lists, helpers
    ├── views/           dashboard.js, customers.js, sales.js, service.js
    └── app.js           Connects the tabs and starts the app
```

The scripts share global variables rather than using modules, so keep the order in `index.html`. To add a tab, create a file in `js/views/`, add its script tag before `app.js`, and add it to the lists in `app.js`.

## Data

Stored in the browser's `localStorage`: `crm_v1` (customers, deals, tickets, notes) and `auth_crm` (accounts). Data is per browser and does not sync between devices. Clearing site data resets it to the sample records in `js/data.js`.

## Customising

- Stages, priorities, statuses and lead sources are the lists at the top of `js/data.js`.
- Sample data is in `js/data.js` and only applies when nothing is saved.
- Colours are the CSS variables at the top of `css/styles.css`.

## Limits

Accounts and data live in the browser, so anyone with access to that browser profile can read or change them. It is not suited to sensitive records.
