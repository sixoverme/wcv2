import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function GuidelinesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-earth-800">Community Guidelines</h1>
        <p className="text-muted-foreground mt-1">
          Our shared values and principles for a thriving mutual aid community
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Our Community Values</CardTitle>
          <CardDescription>
            Woven Circles is built on principles of reciprocity, respect, and community care
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-earth-800">Reciprocity</h3>
            <p>
              We believe in the power of mutual aid—giving what we can and receiving what we need. There is no
              expectation of direct exchange, but rather a culture of generosity that strengthens our collective
              resilience.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-earth-800">Respect</h3>
            <p>
              We honor the dignity of every community member. We recognize that each person brings valuable knowledge,
              skills, and experiences. We listen deeply and speak with care.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-earth-800">Accountability</h3>
            <p>
              We are accountable to each other and to the community as a whole. We acknowledge when harm occurs, take
              responsibility for our actions, and work together to repair relationships.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-earth-800">Inclusion</h3>
            <p>
              We actively work to make our community accessible to all, recognizing that systems of oppression create
              barriers to participation. We center the voices and needs of those most impacted by injustice.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Community Agreements</CardTitle>
          <CardDescription>How we put our values into practice</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-3 list-disc pl-5">
            <li>
              <strong>Share resources with care and intention.</strong> Be clear about what you're offering or
              requesting, and follow through on your commitments.
            </li>
            <li>
              <strong>Communicate respectfully.</strong> Use language that honors the dignity of all community members.
              Avoid assumptions about people's identities or experiences.
            </li>
            <li>
              <strong>Respect privacy and consent.</strong> Don't share personal information about others without their
              explicit permission.
            </li>
            <li>
              <strong>Address conflicts directly when possible.</strong> If you experience or witness harm, address it
              directly with the person involved if it feels safe to do so.
            </li>
            <li>
              <strong>Use the reporting system when needed.</strong> If direct communication isn't possible or doesn't
              resolve the issue, use the reporting feature to alert community moderators.
            </li>
            <li>
              <strong>Contribute to collective care.</strong> Look out for each other's wellbeing. Check in with
              community members who may need support.
            </li>
            <li>
              <strong>Share knowledge and skills.</strong> Teach and learn from each other to build our collective
              resilience and reduce dependence on systems that don't serve us.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Moderation Approach</CardTitle>
          <CardDescription>How we maintain a healthy community space</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Woven Circles uses a community-based moderation approach. When content is reported, it is reviewed by a
            rotating group of community moderators who have been trained in our values and agreements.
          </p>

          <p>
            Our goal is always to address harm, repair relationships, and maintain a safe and supportive community
            space. We approach moderation with compassion and a commitment to growth rather than punishment.
          </p>

          <p>
            In cases where content clearly violates our community agreements or poses a risk to community members, it
            may be removed. The person who posted it will be contacted privately to discuss the issue and find a path
            forward.
          </p>

          <p>
            Repeated or severe violations may result in temporary or permanent removal from the platform, but this is
            always a last resort after attempts at dialogue and repair.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

