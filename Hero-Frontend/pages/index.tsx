import React from "react";
import { Card, CardBody, Button, Input } from "@nextui-org/react";
import DefaultLayout from "@/layouts/default";

const BirthdayGreetingsPage = () => {
  return (
    <DefaultLayout>
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">Greetings</h1>

        {/* Scrollytelling Sections */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Scrollytelling Sections
          </h2>
          <div className="h-40 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Curated Messages */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Curated Messages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Empty placeholder cards */}
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="h-40"></Card>
            ))}
          </div>
        </div>

        {/* Join the Celebration */}
        <div className="mb-8">
          <Card>
            <CardBody>
              <h2 className="text-xl font-semibold mb-4">
                Join the Celebration - Share Your Wishes
              </h2>
              <p className="mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                hendrerit mi eget massa vehicula, in commodo ex euismod.
              </p>
              <div className="flex gap-4">
                <Input placeholder="Type your message" className="flex-grow" />
                <Button color="primary">Send Your Message</Button>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 bg-gray-100">
          <h2 className="text-3xl font-bold">BIG FOOTER</h2>
        </footer>
      </div>
    </DefaultLayout>
  );
};

export default BirthdayGreetingsPage;
