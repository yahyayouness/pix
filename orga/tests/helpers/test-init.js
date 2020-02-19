export function createUserWithMembership() {
  const user = server.create('user', { firstName: 'Harry', lastName: 'Cover', email: 'harry@cover.com', 'pixOrgaTermsOfServiceAccepted': false });

  const organization = server.create('organization', {
    name: 'BRO & Evil Associates'
  });

  const memberships = server.create('membership', {
    organizationId: organization.id,
    userId: user.id
  });

  const organizationUserInformations = server.create('organization-user-information', { organization, user });

  user.memberships = [memberships];
  user.organizationUserInformations = organizationUserInformations;
  return user;
}

export function createUserWithMembershipAndTermsOfServiceAccepted() {
  const user = server.create('user', { firstName: 'Harry', lastName: 'Cover', email: 'harry@cover.com', 'pixOrgaTermsOfServiceAccepted': true });

  const organization = server.create('organization', {
    name: 'BRO & Evil Associates',
    externalId: 'EXTBRO'
  });

  const memberships = server.create('membership', {
    organizationId: organization.id,
    userId: user.id
  });

  const organizationUserInformations = server.create('organization-user-information', { organization, user });

  user.memberships = [memberships];
  user.organizationUserInformations = organizationUserInformations;
  return user;
}

export function createUserWithMultipleMemberships() {
  const user = server.create('user', { firstName: 'Harry', lastName: 'Cover', email: 'harry@cover.com', 'pixOrgaTermsOfServiceAccepted': true });

  const firstOrganization = server.create('organization', {
    name: 'BRO & Evil Associates',
    externalId: 'EXTBRO'
  });

  const secondOrganization = server.create('organization', {
    name: 'My Heaven Company',
    externalId: 'HEAVEN'
  });

  const firstMembership = server.create('membership', {
    organizationId: firstOrganization.id,
    userId: user.id
  });

  const secondMembership = server.create('membership', {
    organizationId: secondOrganization.id,
    userId: user.id
  });

  server.create('organization-user-information', { organization: firstOrganization, user });

  user.memberships = [firstMembership, secondMembership];

  return user;
}

export function createUserMembershipWithRole(organizationRole) {
  const user = server.create('user', { firstName: 'Harry', lastName: 'Cover', email: 'harry@cover.com', 'pixOrgaTermsOfServiceAccepted': true });

  const organization = server.create('organization', {
    name: 'BRO & Evil Associates'
  });

  const memberships = server.create('membership', {
    userId: user.id,
    organizationId: organization.id,
    organizationRole,
  });

  const organizationUserInformations = server.create('organization-user-information', { organization, user });

  user.memberships = [memberships];
  user.organizationUserInformations = organizationUserInformations;
  return user;
}

export function createAdminMembershipWithNbMembers(countMembers) {

  const organization = server.create('organization', {
    name: 'BRO & Evil Associates'
  });

  const admin = server.create('user', {
    firstName: 'Harry',
    lastName: 'Cover',
    email: 'harry@cover.com',
    'pixOrgaTermsOfServiceAccepted': true
  });

  const adminMemberships = server.create('membership', {
    userId: admin.id,
    organizationId: organization.id,
    organizationRole: 'ADMIN',
  });

  const organizationUserInformations = server.create('organization-user-information', { organization, user: admin });

  admin.memberships[0] = adminMemberships;
  admin.organizationUserInformations = organizationUserInformations;

  for (let i = 1; i < countMembers; i++) {

    const user = server.create('user', {
      firstName: 'Harry',
      lastName: 'Cover',
      email: 'harry@cover.com',
      'pixOrgaTermsOfServiceAccepted': true
    });

    admin.memberships[i] = server.create('membership', {
      userId: user.id,
      organizationId: organization.id,
      organizationRole: 'ADMIN',
    });
  }
  return admin;
}

export function createUserManagingStudents(role = 'MEMBER') {
  const user = server.create('user', { firstName: 'Harry', lastName: 'Cover', email: 'harry@cover.com', 'pixOrgaTermsOfServiceAccepted': true });

  const organization = server.create('organization', {
    name: 'BRO & Evil Associates',
    type: 'SCO',
    isManagingStudents: true
  });

  const memberships = server.create('membership', {
    userId: user.id,
    organizationId: organization.id,
    organizationRole: role
  });

  const organizationUserInformations = server.create('organization-user-information', { organization, user });

  user.memberships = [memberships];
  user.organizationUserInformations = organizationUserInformations;
  return user;
}
