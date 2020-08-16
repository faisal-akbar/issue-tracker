document
  .getElementById('issueInputForm')
  .addEventListener('submit', printIssue);

function submitIssue() {
  const getInputValue = (id) => document.getElementById(id).value;
  const description = getInputValue('issueDescription');
  const severity = getInputValue('issueSeverity');
  const assignedTo = getInputValue('issueAssignedTo');
  const id = Math.floor(Math.random() * 100000000) + '';
  const status = 'Open';

  const dateTime = new Date().toLocaleString(); // added

  const issue = {
    id,
    description,
    severity,
    assignedTo,
    status,
    dateTime, // added
  };
  let issues = [];
  if (localStorage.getItem('issues')) {
    issues = JSON.parse(localStorage.getItem('issues'));
  }
  issues.push(issue);
  localStorage.setItem('issues', JSON.stringify(issues));

  document.getElementById('issueInputForm').reset();
  fetchIssues();
  // e.preventDefault();
}

const closeIssue = (id) => {
  const issues = JSON.parse(localStorage.getItem('issues'));
  const currentIssue = issues.find((issue) => issue.id == id); // before ===
  currentIssue.status = 'Closed';
  currentIssue.description = currentIssue.description.strike();
  localStorage.setItem('issues', JSON.stringify(issues));
  fetchIssues();

};

const deleteIssue = (id) => {
  if (confirm('Are You Sure?')) {
    const issues = JSON.parse(localStorage.getItem('issues'));
    const remainingIssues = issues.filter((issue) => issue.id != id); // issue.id !== id

    localStorage.setItem('issues', JSON.stringify(remainingIssues));
    fetchIssues(); // before it was missing
  }
};

const fetchIssues = () => {
  let issues;
  if (localStorage.getItem('issues') === null) {
    issues = [];
  } else {
    issues = JSON.parse(localStorage.getItem('issues'));
  }

  // const issues = JSON.parse(localStorage.getItem('issues')); // before null check condition was missing

  const issuesList = document.getElementById('issuesList');
  issuesList.innerHTML = '';

  for (var i = 0; i < issues.length; i++) {
    const {
      id,
      description,
      severity,
      assignedTo,
      status,
      dateTime
    } = issues[
      i
    ];

    issuesList.innerHTML += `<div class="well">
                              <h6>Issue ID: ${id} </h6>
                              <h6>Timestamp: ${dateTime}</h6>
                              <p><span class="issue-status"> ${status} </span></p>
                              <h3 class="issue-desc"> ${description}</h3>
                              <p><span class="glyphicon glyphicon-time"></span> ${severity}</p>
                              <p><span class="glyphicon glyphicon-user"></span> ${assignedTo}</p>
                              <a href="#" onclick="closeIssue(${id})" class="btn btn-closed">Close</a>
                              <a href="#" onclick="deleteIssue(${id})" class="btn btn-danger">Delete</a>
                              </div>`;

    // <a href="#" onclick="setStatusClosed(${id})" class="btn btn-warning">Close</a>
    // is replaced with
    // <a href="#" onclick="closeIssue(${id})" class="btn btn-warning">Close</a>

    // <p><span class="issue-status label label-info"> ${status} </span></p>

    // status badge for closed issue
    if (status == 'Closed') {
      const closedIssueStatus = document.querySelector('.issue-status');
      closedIssueStatus.className = 'label badge-closed';
    }

    // status badge for open issue
    if (status == 'Open') {
      const openIssueStatus = document.querySelector('.issue-status');
      openIssueStatus.className = 'label badge-open';
    }
  }

  // Total issue
  const totalIssue = document.getElementById('total-issue');
  totalIssue.innerText = issues.length;

  getCount('closed-issue', 'Closed');
  getCount('open-issue', 'Open');

  // get open issue and closed issue count
  function getCount(id, issueStatus) {
    const issueCount = document.getElementById(id);
    const statusFilter = issues.filter((issue) => issue.status == issueStatus);
    issueCount.innerText = statusFilter.length;
  }
};

// Added notification functionality, if no validation is success call submitIssue function
function printIssue(e) {
  const issueDesc = document.getElementById('issueDescription').value;
  const issueAssignedTo = document.getElementById('issueAssignedTo').value;

  if (issueDesc == '' && issueAssignedTo == '') {
    alertNotification('empty-both', 'block');
    setTimeout(clearNotification, 3000);
  } else if (issueDesc == '') {
    alertNotification('empty-desc', 'block');
    setTimeout(clearNotification, 3000);
  } else if (issueAssignedTo == '') {
    alertNotification('empty-assign', 'block');
    setTimeout(clearNotification, 3000);
  } else {
    submitIssue(e);
  }
  e.preventDefault();
}

function alertNotification(Id, value) {
  document.getElementById(Id).style.display = value;
}

function clearNotification() {
  alertNotification('empty-desc', 'none');
  alertNotification('empty-assign', 'none');
  alertNotification('empty-both', 'none');
}

//  // Closed issue count
//  const closedIssue = document.getElementById('closed-issue');
//  const closedIssueFilter = issues.filter(issue => issue.status == 'Closed');
//  closedIssue.innerText = closedIssueFilter.length;

//  // Open Issue
//  const openIssue = document.getElementById('open-issue');
//  const openIssueFilter = issues.filter(issue => issue.status == 'Open');
//  openIssue.innerText = openIssueFilter.length;