// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title CivicReporting
 * @dev Smart contract for transparent civic issue reporting and tracking
 */
contract CivicReporting is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    Counters.Counter private _reportIds;
    
    // Report status enum
    enum ReportStatus { 
        Submitted, 
        Verified, 
        Assigned, 
        InProgress, 
        Resolved, 
        Closed 
    }
    
    // Report category enum
    enum ReportCategory { 
        Pothole, 
        Garbage, 
        Streetlight, 
        Water, 
        Road, 
        Drainage, 
        Other 
    }
    
    // Report structure
    struct Report {
        uint256 id;
        string ipfsHash;
        address reporter;
        ReportCategory category;
        ReportStatus status;
        uint256 latitude;
        uint256 longitude;
        uint256 priority;
        uint256 createdAt;
        uint256 verifiedAt;
        uint256 assignedAt;
        uint256 resolvedAt;
        address assignedDepartment;
        bool isAnonymous;
        uint256 reputationReward;
    }
    
    // Department structure
    struct Department {
        address departmentAddress;
        string name;
        bool isActive;
        uint256 totalAssigned;
        uint256 totalResolved;
        uint256 averageResolutionTime;
    }
    
    // SLA structure
    struct SLA {
        uint256 responseTimeHours;
        uint256 resolutionTimeHours;
        uint256 penaltyAmount;
    }
    
    // Mappings
    mapping(uint256 => Report) public reports;
    mapping(address => Department) public departments;
    mapping(address => uint256) public userReputation;
    mapping(ReportCategory => SLA) public categorysSLA;
    mapping(uint256 => address[]) public reportUpvoters;
    mapping(address => mapping(uint256 => bool)) public hasUpvoted;
    
    // Events
    event ReportSubmitted(
        uint256 indexed reportId,
        address indexed reporter,
        ReportCategory category,
        string ipfsHash,
        bool isAnonymous
    );
    
    event ReportStatusUpdated(
        uint256 indexed reportId,
        ReportStatus oldStatus,
        ReportStatus newStatus,
        address updatedBy
    );
    
    event ReportAssigned(
        uint256 indexed reportId,
        address indexed department,
        uint256 assignedAt
    );
    
    event ReportResolved(
        uint256 indexed reportId,
        address indexed department,
        uint256 resolutionTime
    );
    
    event DepartmentRegistered(
        address indexed departmentAddress,
        string name
    );
    
    event ReputationAwarded(
        address indexed user,
        uint256 points,
        string reason
    );
    
    event SLABreached(
        uint256 indexed reportId,
        address indexed department,
        uint256 breachTime
    );
    
    // Modifiers
    modifier onlyDepartment() {
        require(departments[msg.sender].isActive, "Not an active department");
        _;
    }
    
    modifier reportExists(uint256 _reportId) {
        require(_reportId > 0 && _reportId <= _reportIds.current(), "Report does not exist");
        _;
    }
    
    modifier onlyReporter(uint256 _reportId) {
        require(reports[_reportId].reporter == msg.sender, "Not the report owner");
        _;
    }
    
    constructor() {
        // Initialize default SLAs
        categorysSLA[ReportCategory.Pothole] = SLA(24, 72, 0.1 ether);
        categorysSLA[ReportCategory.Garbage] = SLA(12, 48, 0.05 ether);
        categorysSLA[ReportCategory.Streetlight] = SLA(48, 120, 0.08 ether);
        categorysSLA[ReportCategory.Water] = SLA(6, 24, 0.2 ether);
        categorysSLA[ReportCategory.Road] = SLA(48, 168, 0.15 ether);
        categorysSLA[ReportCategory.Drainage] = SLA(24, 96, 0.1 ether);
        categorysSLA[ReportCategory.Other] = SLA(72, 240, 0.05 ether);
    }
    
    /**
     * @dev Submit a new civic issue report
     */
    function submitReport(
        string memory _ipfsHash,
        ReportCategory _category,
        uint256 _latitude,
        uint256 _longitude,
        uint256 _priority,
        bool _isAnonymous
    ) external returns (uint256) {
        _reportIds.increment();
        uint256 newReportId = _reportIds.current();
        
        reports[newReportId] = Report({
            id: newReportId,
            ipfsHash: _ipfsHash,
            reporter: _isAnonymous ? address(0) : msg.sender,
            category: _category,
            status: ReportStatus.Submitted,
            latitude: _latitude,
            longitude: _longitude,
            priority: _priority,
            createdAt: block.timestamp,
            verifiedAt: 0,
            assignedAt: 0,
            resolvedAt: 0,
            assignedDepartment: address(0),
            isAnonymous: _isAnonymous,
            reputationReward: 0
        });
        
        // Award reputation for reporting
        if (!_isAnonymous) {
            _awardReputation(msg.sender, 10, "Report submission");
        }
        
        emit ReportSubmitted(newReportId, msg.sender, _category, _ipfsHash, _isAnonymous);
        
        return newReportId;
    }
    
    /**
     * @dev Update report status (only departments)
     */
    function updateReportStatus(
        uint256 _reportId,
        ReportStatus _newStatus
    ) external onlyDepartment reportExists(_reportId) {
        Report storage report = reports[_reportId];
        ReportStatus oldStatus = report.status;
        
        require(_newStatus != oldStatus, "Status unchanged");
        require(_isValidStatusTransition(oldStatus, _newStatus), "Invalid status transition");
        
        report.status = _newStatus;
        
        // Update timestamps based on status
        if (_newStatus == ReportStatus.Verified) {
            report.verifiedAt = block.timestamp;
        } else if (_newStatus == ReportStatus.Assigned) {
            report.assignedAt = block.timestamp;
            report.assignedDepartment = msg.sender;
            departments[msg.sender].totalAssigned++;
        } else if (_newStatus == ReportStatus.Resolved) {
            report.resolvedAt = block.timestamp;
            departments[msg.sender].totalResolved++;
            
            // Calculate resolution time and update department metrics
            uint256 resolutionTime = block.timestamp - report.assignedAt;
            _updateDepartmentMetrics(msg.sender, resolutionTime);
            
            // Award reputation to reporter
            if (!report.isAnonymous) {
                _awardReputation(report.reporter, 50, "Report resolved");
            }
            
            emit ReportResolved(_reportId, msg.sender, resolutionTime);
        }
        
        emit ReportStatusUpdated(_reportId, oldStatus, _newStatus, msg.sender);
        
        // Check for SLA breach
        _checkSLABreach(_reportId);
    }
    
    /**
     * @dev Register a new department
     */
    function registerDepartment(
        address _departmentAddress,
        string memory _name
    ) external onlyOwner {
        require(_departmentAddress != address(0), "Invalid address");
        require(!departments[_departmentAddress].isActive, "Department already exists");
        
        departments[_departmentAddress] = Department({
            departmentAddress: _departmentAddress,
            name: _name,
            isActive: true,
            totalAssigned: 0,
            totalResolved: 0,
            averageResolutionTime: 0
        });
        
        emit DepartmentRegistered(_departmentAddress, _name);
    }
    
    /**
     * @dev Upvote a report to increase its priority
     */
    function upvoteReport(uint256 _reportId) external reportExists(_reportId) {
        require(!hasUpvoted[msg.sender][_reportId], "Already upvoted");
        require(reports[_reportId].status != ReportStatus.Resolved, "Report already resolved");
        
        reportUpvoters[_reportId].push(msg.sender);
        hasUpvoted[msg.sender][_reportId] = true;
        
        // Increase priority based on upvotes
        if (reportUpvoters[_reportId].length >= 5) {
            reports[_reportId].priority = reports[_reportId].priority + 1;
        }
    }
    
    /**
     * @dev Get report details
     */
    function getReport(uint256 _reportId) external view reportExists(_reportId) returns (Report memory) {
        return reports[_reportId];
    }
    
    /**
     * @dev Get total number of reports
     */
    function getTotalReports() external view returns (uint256) {
        return _reportIds.current();
    }
    
    /**
     * @dev Get department details
     */
    function getDepartment(address _departmentAddress) external view returns (Department memory) {
        return departments[_departmentAddress];
    }
    
    /**
     * @dev Get user reputation
     */
    function getUserReputation(address _user) external view returns (uint256) {
        return userReputation[_user];
    }
    
    /**
     * @dev Check if status transition is valid
     */
    function _isValidStatusTransition(ReportStatus _from, ReportStatus _to) private pure returns (bool) {
        if (_from == ReportStatus.Submitted) {
            return _to == ReportStatus.Verified;
        } else if (_from == ReportStatus.Verified) {
            return _to == ReportStatus.Assigned;
        } else if (_from == ReportStatus.Assigned) {
            return _to == ReportStatus.InProgress;
        } else if (_from == ReportStatus.InProgress) {
            return _to == ReportStatus.Resolved;
        } else if (_from == ReportStatus.Resolved) {
            return _to == ReportStatus.Closed;
        }
        return false;
    }
    
    /**
     * @dev Award reputation to a user
     */
    function _awardReputation(address _user, uint256 _points, string memory _reason) private {
        userReputation[_user] += _points;
        emit ReputationAwarded(_user, _points, _reason);
    }
    
    /**
     * @dev Update department performance metrics
     */
    function _updateDepartmentMetrics(address _department, uint256 _resolutionTime) private {
        Department storage dept = departments[_department];
        
        // Calculate new average resolution time
        uint256 totalTime = dept.averageResolutionTime * (dept.totalResolved - 1) + _resolutionTime;
        dept.averageResolutionTime = totalTime / dept.totalResolved;
    }
    
    /**
     * @dev Check for SLA breach
     */
    function _checkSLABreach(uint256 _reportId) private {
        Report storage report = reports[_reportId];
        SLA memory sla = categorysSLA[report.category];
        
        uint256 currentTime = block.timestamp;
        uint256 responseDeadline = report.createdAt + (sla.responseTimeHours * 1 hours);
        uint256 resolutionDeadline = report.assignedAt + (sla.resolutionTimeHours * 1 hours);
        
        // Check response time breach
        if (report.status == ReportStatus.Submitted && currentTime > responseDeadline) {
            emit SLABreached(_reportId, report.assignedDepartment, currentTime - responseDeadline);
        }
        
        // Check resolution time breach
        if (report.status != ReportStatus.Resolved && 
            report.assignedAt > 0 && 
            currentTime > resolutionDeadline) {
            emit SLABreached(_reportId, report.assignedDepartment, currentTime - resolutionDeadline);
        }
    }
    
    /**
     * @dev Update SLA for a category (only owner)
     */
    function updateSLA(
        ReportCategory _category,
        uint256 _responseTimeHours,
        uint256 _resolutionTimeHours,
        uint256 _penaltyAmount
    ) external onlyOwner {
        categorysSLA[_category] = SLA(_responseTimeHours, _resolutionTimeHours, _penaltyAmount);
    }
}
