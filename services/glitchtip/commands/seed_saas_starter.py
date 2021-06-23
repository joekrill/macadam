from django.core.management.base import BaseCommand, CommandError

from users.models import User
from organizations_ext.models import Organization, OrganizationUser, OrganizationUserRole, OrganizationOwner
from teams.models import Team
from projects.models import Project, ProjectKey

USER_EMAIL = 'saasstarter@example.com'
USER_PASS = 'saasstarter'
USER_NAME = 'SaaS Starter'
ORG_SLUG = 'saas-starter-org'
ORG_NAME = 'SaaS Starter'
TEAM_SLUG = 'saas-starter-team'
WEB_PROJECT_SLUG = 'saas-starter-web-client'
WEB_PROJECT_NAME = 'SaaS Starter Web Client'
WEB_PROJECT_KEY = '239d589a-58d2-4675-be81-59b19718b22e'
API_PROJECT_SLUG = 'saas-starter-api-servier'
API_PROJECT_NAME = 'SaaS Starter API Server'
API_PROJECT_KEY = '31e5d046-1ecc-46ce-9f32-af55e9f4af88'

class Command(BaseCommand):
    help = 'Creates a user, organization, team, and projects for use with SaaS Starter'

    def handle(self, *args, **options):   
      if User.objects.filter(email=USER_EMAIL).count() == 0: 
        self.stdout.write(self.style.MIGRATE_HEADING('Seeding GlitchTip for SaaS Starter...'))

        user = User(email=USER_EMAIL, name=USER_NAME, is_staff=True, is_superuser=True)
        user.set_password(USER_PASS)
        user.save()

        org = Organization(slug=ORG_SLUG, name=ORG_NAME)
        org.save()

        orgUser = OrganizationUser(user=user, role=OrganizationUserRole.ADMIN, organization=org)
        orgUser.save()

        orgOwner = OrganizationOwner(organization=org, organization_user=orgUser)

        team = Team(slug=TEAM_SLUG, organization=org)
        team.save()
        team.members.add(orgUser)

        webProject = Project(slug=WEB_PROJECT_SLUG, name=WEB_PROJECT_NAME, organization=org, platform="javascript-react", team=team)
        webProject.save()
        team.projects.add(webProject);
        webProjectKey = ProjectKey.objects.get(project=webProject)
        webProjectKey.public_key = WEB_PROJECT_KEY
        webProjectKey.save()

        apiProject = Project(slug=API_PROJECT_SLUG, name=API_PROJECT_NAME, organization=org, platform="node-koa", team=team)
        apiProject.save()
        team.projects.add(apiProject);
        apiProjectKey = ProjectKey.objects.get(project=apiProject)
        apiProjectKey.public_key = API_PROJECT_KEY
        apiProjectKey.save()

        self.stdout.write(self.style.SUCCESS('GlitchTip seeding complete!'))
      else:
        self.stdout.write(self.style.SUCCESS('GlitchTip already seeded'))
