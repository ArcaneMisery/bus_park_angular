const Router = require("express");
const router = new Router();
const TicketController = require("../controllers/ticket-controller");

router.get("/unpaid_tickets", TicketController.bookTickets);
router.post("/sell_ticket", TicketController.sellTicket);
router.post("/add_ticket", TicketController.addTicket);

module.exports = router;