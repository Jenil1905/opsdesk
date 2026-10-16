def test_health_check(client):
    """Test liveness probe endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_ready_check(client):
    """Test readiness probe endpoint with DB ping"""
    response = client.get("/ready")
    assert response.status_code == 200
    assert response.json()["status"] == "ready"

def test_create_ticket(client):
    """Test creating a new incident ticket (POST /api/tickets)"""
    payload = {
        "title": "DNS Latency in us-west-2 Core Cluster",
        "description": "CoreDNS pods throttling under excessive external query loads.",
        "service": "k8s-ingress",
        "priority": "P1 - High",
        "status": "OPEN",
        "assignee": "Jordan Miller",
        "reporter": "CloudWatch Alarm"
    }
    response = client.post("/api/tickets", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] is not None
    assert data["title"] == payload["title"]
    assert data["priority"] == "P1 - High"
    assert data["status"] == "OPEN"

def test_get_tickets_list(client):
    """Test fetching all tickets (GET /api/tickets)"""
    response = client.get("/api/tickets")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_single_ticket_and_not_found(client):
    """Test retrieving ticket by ID and 404 behavior"""
    # Create one first
    create_res = client.post("/api/tickets", json={
        "title": "S3 Bucket Replication Delay",
        "description": "Cross-region backup bucket synchronization stalled.",
        "service": "core-platform",
        "priority": "P2 - Medium",
        "status": "OPEN"
    })
    ticket_id = create_res.json()["id"]

    # Fetch existing
    res = client.get(f"/api/tickets/{ticket_id}")
    assert res.status_code == 200
    assert res.json()["title"] == "S3 Bucket Replication Delay"

    # Fetch non-existent
    bad_res = client.get("/api/tickets/999999")
    assert bad_res.status_code == 404

def test_update_ticket(client):
    """Test updating status and priority (PUT /api/tickets/{id})"""
    create_res = client.post("/api/tickets", json={
        "title": "Kafka Broker Partition Lag",
        "description": "Consumer group offset lagging by 12,000 messages.",
        "service": "core-platform",
        "priority": "P1 - High",
        "status": "OPEN"
    })
    ticket_id = create_res.json()["id"]

    update_payload = {
        "status": "INVESTIGATING",
        "assignee": "Liam Vance"
    }
    put_res = client.put(f"/api/tickets/{ticket_id}", json=update_payload)
    assert put_res.status_code == 200
    updated_data = put_res.json()
    assert updated_data["status"] == "INVESTIGATING"
    assert updated_data["assignee"] == "Liam Vance"

def test_delete_ticket(client):
    """Test deleting ticket (DELETE /api/tickets/{id})"""
    create_res = client.post("/api/tickets", json={
        "title": "Temporary Test Ticket to be Deleted",
        "description": "This ticket will be deleted immediately for testing.",
        "service": "core-platform",
        "priority": "P3 - Low",
        "status": "OPEN"
    })
    ticket_id = create_res.json()["id"]

    del_res = client.delete(f"/api/tickets/{ticket_id}")
    assert del_res.status_code == 204

    # Confirm it's gone
    get_res = client.get(f"/api/tickets/{ticket_id}")
    assert get_res.status_code == 404

def test_get_ticket_stats(client):
    """Test statistics endpoint (GET /api/tickets/stats)"""
    res = client.get("/api/tickets/stats")
    assert res.status_code == 200
    stats = res.json()
    assert "total_tickets" in stats
    assert "open_tickets" in stats
    assert "resolution_rate" in stats
    assert "by_service" in stats

def test_metrics_endpoint(client):
    """Test Prometheus metrics scrape endpoint"""
    res = client.get("/metrics")
    assert res.status_code == 200
    assert "http_requests" in res.text or "http_request_duration" in res.text or "process_cpu" in res.text
