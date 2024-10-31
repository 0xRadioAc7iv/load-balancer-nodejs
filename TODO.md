## v1

- [x] Cache GET Requests & Invalidate it after a certain period.
- [x] Implement Failover Strategies (Discard Unavailable Servers)
- [x] Add TLS Support for HTTPS
- [x] Implement Rate Limiting
- [x] Add Logging for each Request & Response
- [x] Add gzip Compression for each response
- [x] Document the code
- [ ] Write Tests
- [x] Add [README.md](./README.md)

## v2

- [ ] Implement Least Connections for load balancing
- [ ] Implement Client Auth & Sticky Sessions
- [ ] Role based Rate Limiting (Free vs Premium Users)
  - Premium Users have a higher rate limit than Free Users
- [ ] Detailed Monitoring & Metrics
  - Implement detailed logging of metrics, including server response times, cache hit ratios, traffic distribution, and load balancer health.
- [ ] Admin Dashboard
  - visualize and manage server status, request logs, rate limits, and traffic distribution.
- [ ] Add Support for Websocket Servers
- [ ] Config to change between HTTP & Websocket Load Balancer
- [ ] Document the code
- [ ] Write Tests
- [ ] Refactor & Improve the Code
