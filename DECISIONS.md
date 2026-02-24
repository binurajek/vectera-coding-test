# DECISIONS

- **Key choices you made & trade-offs.**
  - Ussed simple API polling for summary updates. Its fast to implement, but Web Sockets would be better for production environment.
  - Refactored Angular components into a lazy-loaded feature module to improve codebase scalability.

- **Deviations from the initial spec (if any) and why.**
  - Styled the `/meetings` list as a responsive CSS grid instead of a basic `<ul>` to provide a cleaner, more modern UI.
  - Combined the `POST` and `GET` notes routes into a single method in Django views to fix a `Method Not Allowed` router conflict.

- **Next improvements you'd make if you had more time.**
  - Build a proper "Create Meeting" form/modal in the UI.
  - Implement a real background task for generating the summary.
  - Add more comprehensive DOM tests in Angular.

- **Time spent per area.**
  - Frontend (UI / Angular): approximately 4 hours.
  - Backend (Python / Django): approximately 4 to 5 hours. Since Python/Django is new to me, some of this time was spent learning the application and request flow before coding.



<!-- List of docker commands used -->

List all the tables : docker exec vectera-coding-test-db-1 psql -U app -d app -c '\dt'

Fetch the data:

docker exec -it vectera-coding-test-db-1 psql -U app -d app -c "SELECT * FROM meetings_meeting;"

docker exec -it vectera-coding-test-db-1 psql -U app -d app -c "SELECT * FROM meetings_note;"

docker exec -it vectera-coding-test-db-1 psql -U app -d app -c "SELECT * FROM meetings_summary;"

docker exec -it vectera-coding-test-db-1 psql -U app -d app

docker exec -it vectera-coding-test-db-1 psql -U app -d app -c "INSERT INTO meetings_meeting (title, started_at, created_at) VALUES ('Binuraj Meeting', NOW(), NOW());"

docker compose exec backend pytest
